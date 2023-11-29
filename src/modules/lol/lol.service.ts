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
import { QueueIDType, RegionAliasType, RegionContinent } from './lol.enum';
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
  ): Promise<Ranking[]> {
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

      const player: Player = await this.playerService.getPlayerByUniqueId(
        summoner.id,
        summoner.name,
        summoner.puuid,
      );

      const leagueEntries =
        await this.leagueService.getLeagueEntriesBySummonerID(
          player.summonerId,
        );
      let playerSummary: Ranking[] = [];
      for (const leagueEntry of leagueEntries) {
        let playerSummaryData =
          await this.matchSummaryService.getPlayerSummaryByPlayerIdAndQueue(
            player.id,
            QueueIDType[leagueEntry.queueType],
          );
        let ranking: Ranking;
        let kda = this.calculateKDA(
          +playerSummaryData.kills,
          +playerSummaryData.assists,
          +playerSummaryData.deaths,
        );

        ranking = await this.rankingService.upsertRanking(
          {
            summonerId: player.summonerId,
            summonerName: player.name,
            region: region,
            tier: leagueEntry.tier,
            rank: leagueEntry.rank,
            leaguePoints: leagueEntry.leaguePoints,
            kills: +playerSummaryData.kills,
            deaths: +playerSummaryData.deaths,
            assists: +playerSummaryData.assists,
            kda: kda,
            winRate: +(leagueEntry.wins / leagueEntry.losses).toFixed(2),
            avgVisionScore: +playerSummaryData.avgVisionScore,
            avgCSPerMinute: +playerSummaryData.avgCSPerMinute,
            summonerLevel: summoner.summonerLevel,
            queueId: QueueIDType[leagueEntry.queueType],
            queueType: leagueEntry.queueType,
            playerId: player.id,
          },
          player.summonerId,
          leagueEntry.queueType,
          region,
        );
        if (
          ranking.queueId == queueId ||
          (queueId != null && queueId == QueueIDType.ALL)
        ) {
          playerSummary.push(ranking);
        }
      }
      return playerSummary;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getLeaderBoardRanking(
    summonerName: string,
    region: RegionAliasType = RegionAliasType.NA1,
  ): Promise<any> {
    try {
      const summoner = await this.summonerService.getSummonerByNameAndRegion(
        summonerName,
        region,
      );

      const player: Player = await this.playerService.getPlayerByUniqueId(
        summoner.id,
        summoner.name,
        summoner.puuid,
      );
      let positionRankingLGPoints =
        await this.rankingService.getRankingPosition(
          player.summonerId,
          'league_points',
        );
      let positionRankingWinRate = await this.rankingService.getRankingPosition(
        player.summonerId,
        'win_rate',
      );
      return {
        leaguePoints: {
          top: positionRankingLGPoints.position,
          value: positionRankingLGPoints.league_points,
        },
        winRate: {
          top: positionRankingWinRate.position,
          value: positionRankingWinRate.win_rate,
        },
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private calculateKDA(kills: number, assists: number, deaths: number): number {
    let deathIdx = deaths == 0 ? 1 : deaths;
    return +((kills + assists) / deathIdx).toFixed(2);
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
        let cSPerMinute = (
          (participantDto.trueDamageDealt -
            participantDto.trueDamageDealtToChampions) /
          totalPlayedInMinutes
        ).toFixed(2);
        let deathIdx = participantDto.deaths == 0 ? 1 : participantDto.deaths;
        let kda = (
          (participantDto.kills + participantDto.assists) /
          deathIdx
        ).toFixed(2);
        let matchSummaryDto: MatchSummaryDto = {
          matchId: matchID,
          summonerName: participantDto.summonerName,
          championName: participantDto.championName,
          kills: participantDto.kills,
          deaths: participantDto.deaths,
          assists: participantDto.assists,
          kda: +kda,
          lane: participantDto.lane,
          timePlayed: participantDto.timePlayed,
          trueDamageDealt: participantDto.trueDamageDealt,
          trueDamageDealtToChampions: participantDto.trueDamageDealtToChampions,
          cSPerMinute: +cSPerMinute,
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
