import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  MatchSummaryDto,
  ParticipantDto,
} from '../../integrations/lol/match/match.dto';
import { SummonerService } from '../../integrations/lol/summoner/summoner.service';
import { MatchService } from '../../integrations/lol/match/match.service';
import { ConfigService } from '@nestjs/config';
import { PageResponse } from '../../constants/PageResponse';
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../../constants/DefaultPageParams';
import {
  QueueIDType,
  QueueNamesType,
  RegionAliasType,
  RegionContinent,
} from './lol.enum';
import { LeagueService } from '../../integrations/lol/league/league.service';
import { Player } from '../../entities/Player.entity';
import { PlayerService } from './player/player.service';
import { MatchSummaryService } from './match-summary/match-summary.service';
import { RankingService } from './ranking/ranking.service';
import { Ranking } from '../../entities/Ranking.entity';
import { SummonerDto } from '../../integrations/lol/summoner/summoner.dto';

@Injectable()
export class LolService {
  private readonly logger = new Logger(LolService.name);
  constructor(
    private summonerService: SummonerService,
    private matchService: MatchService,
    private leagueService: LeagueService,
    private playerService: PlayerService,
    private matchSummaryService: MatchSummaryService,
    private rankingService: RankingService,
    private readonly configService: ConfigService,
  ) {}
  async getMatches(
    summonerName: string,
    region: RegionAliasType = RegionAliasType.NA1,
    page: number = DEFAULT_PAGE_NO,
    pageSize: number = DEFAULT_PAGE_SIZE,
    queueId: QueueIDType = QueueIDType.ALL,
  ): Promise<PageResponse<MatchSummaryDto>> {
    try {
      const summoner = await this.summonerService.getSummonerByNameAndRegion(
        summonerName,
        region,
      );

      let matchSummaryDtoList = await this.processSummonerInfo(
        summoner,
        region,
        page,
        pageSize,
        queueId,
      );
      return {
        results: matchSummaryDtoList,
        page: page,
        pageSize: pageSize,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getPlayerSummary(
    summonerName: string,
    region: RegionAliasType = RegionAliasType.NA1,
    queueId: QueueIDType = QueueIDType.ALL,
  ): Promise<PageResponse<MatchSummaryDto>> {
    try {
      const summoner = await this.summonerService.getSummonerByNameAndRegion(
        summonerName,
        region,
      );
      await this.processSummonerInfo(
        summoner,
        region,
        DEFAULT_PAGE_NO,
        MAX_PAGE_SIZE,
        queueId,
      );
      let player: Player;
      try {
        player = await this.playerService.getPlayerByUniqueId(
          summoner.id,
          summoner.name,
          summoner.puuid,
        );
        let statsByQueue = {};
        let leagueEntries =
          await this.leagueService.getLeagueEntriesBySummonerID(
            player.summonerId,
          );
        for (const leagueEntry of leagueEntries) {
          statsByQueue[QueueIDType[leagueEntry.queueType]] = {
            rank: leagueEntry.rank,
            tier: leagueEntry.tier,
            leaguePoints: leagueEntry.leaguePoints,
            wins: leagueEntry.wins,
            losses: leagueEntry.losses,
            queueType: leagueEntry.queueType,
          };
        }

        let playerSummaryListData =
          await this.matchSummaryService.getPlayerSummaryByPlayerId(player.id);

        let playerSummary: Ranking[] = [];
        for (const playerSummary of playerSummaryListData) {
          let ranking: Ranking;
          let kda = this.calculateKDA(
            playerSummary.kills,
            playerSummary.assists,
            playerSummary.deaths,
          );
          try {
            ranking = await this.rankingService.upsertRanking(
              {
                id: null,
                summonerId: player.summonerId,
                summonerName: player.name,
                region: region,
                tier: statsByQueue[playerSummary.queueId].tier,
                rank: statsByQueue[playerSummary.queueId].rank,
                leaguePoints: statsByQueue[playerSummary.queueId].leaguePoints,
                kills: playerSummary.kills,
                deaths: playerSummary.deaths,
                assists: playerSummary.assists,
                kda: kda,
                avgVisionScore: playerSummary.avgVisionScore,
                avgCSPerMinute: playerSummary.avgCSPerMinute,
                summonerLevel: summoner.summonerLevel,
                queueId: playerSummary.queueId,
                queueType: statsByQueue[playerSummary.queueId].queueType,
                playerId: player.id,
              },
              player.summonerId,
              QueueNamesType.ARAM,
              region,
            );
            if (
              ranking.queueId == queueId ||
              (queueId != null && queueId == QueueIDType.ALL)
            ) {
              playerSummary.push(ranking);
            }
          } catch (e) {}
        }

        let matchSummaryDtoList: MatchSummaryDto[] = [];
        return {
          results: matchSummaryDtoList,
          page: DEFAULT_PAGE_NO,
          pageSize: DEFAULT_PAGE_SIZE,
        };
      } catch (e) {
        throw e;
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private calculateKDA(kills: number, assists: number, deaths: number): number {
    let deathIdx = deaths == 0 ? 1 : deaths;
    let kda: number = Math.round((kills + assists) / deathIdx);
    return kda;
  }

  private async processSummonerInfo(
    summoner: SummonerDto,
    region: RegionAliasType,
    page: number = DEFAULT_PAGE_NO,
    pageSize: number = DEFAULT_PAGE_SIZE,
    queueId: QueueIDType = QueueIDType.ALL,
  ): Promise<MatchSummaryDto[]> {
    try {
      let player: Player;
      try {
        player = await this.playerService.getPlayerByUniqueId(
          summoner.id,
          summoner.name,
          summoner.puuid,
        );
      } catch (e) {
        if (e instanceof NotFoundException) {
          let newPlayer: Player = {
            summonerId: summoner.id,
            puuid: summoner.puuid,
            name: summoner.name,
            region: region,
          };
          player = await this.playerService.createPlayer(newPlayer);
        }
      }

      const startIndex = page * pageSize - pageSize;
      const currentTimeEpoch = Date.now();
      const regionContinent = RegionContinent[region];
      const matches = await this.matchService.findMatches(
        summoner.puuid,
        regionContinent,
        startIndex,
        pageSize,
        queueId,
        currentTimeEpoch,
      );
      let matchSummaryDtoList: MatchSummaryDto[] = [];
      for (const matchID of matches) {
        let match = await this.matchService.getMatchByID(
          matchID,
          RegionContinent.DEFAULT,
        );
        let participantDto: ParticipantDto;
        match.info.participants.forEach((participant: ParticipantDto) => {
          if (participant.puuid == summoner.puuid) {
            participantDto = participant;
          }
        });
        if (!participantDto) {
          participantDto = new ParticipantDto();
        }
        let totalPlayedInMinutes = ~~(participantDto.timePlayed / 60);
        let cSPerMinute = Math.round(
          (participantDto.trueDamageDealt -
            participantDto.trueDamageDealtToChampions) /
            totalPlayedInMinutes,
        );
        let deathIdx = participantDto.deaths == 0 ? 1 : participantDto.deaths;
        let kda = Math.round(
          (participantDto.kills + participantDto.assists) / deathIdx,
        );
        let matchSummaryDto: MatchSummaryDto = {
          matchId: matchID,
          summonerName: participantDto.summonerName,
          championName: participantDto.championName,
          kills: participantDto.kills,
          deaths: participantDto.deaths,
          assists: participantDto.assists,
          kda: kda,
          lane: participantDto.lane,
          timePlayed: participantDto.timePlayed,
          trueDamageDealt: participantDto.trueDamageDealt,
          trueDamageDealtToChampions: participantDto.trueDamageDealtToChampions,
          cSPerMinute: cSPerMinute,
          visionScore: participantDto.visionScore,
          win: participantDto.win,
          queueId: match.info.queueId,
          gameEndTimestamp: match.info.gameEndTimestamp,
        };
        matchSummaryDtoList.push(matchSummaryDto);

        await this.matchSummaryService.upsertRanking(
          {
            ...matchSummaryDto,
            playerId: player.id,
          },
          matchID,
          player.id,
        );
      }
      return matchSummaryDtoList;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
