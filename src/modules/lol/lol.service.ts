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
} from '../../constants/DefaultPageParams';
import { QueueIDType, RegionAliasType, RegionContinent } from './lol.enum';
import { LeagueService } from '../../integrations/lol/league/league.service';
import { Player } from '../../entities/Player.entity';
import { PlayerService } from './player/player.service';
import { MatchSummaryService } from './match-summary/match-summary.service';
import { RankingService } from './ranking/ranking.service';
import { TransformInstanceToInstance } from 'class-transformer';
import { MatchSummary } from '../../entities/MatchSummary.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { IsDefined, IsOptional, Length } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

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
        let cSPerMinute =
          (participantDto.trueDamageDealt -
            participantDto.trueDamageDealtToChampions) /
          totalPlayedInMinutes;
        let kda =
          (participantDto.kills + participantDto.assists) /
          participantDto.deaths;
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

        await this.matchSummaryService.createMatchSummary({
          ...matchSummaryDto,
          playerId: player.id,
        });
      }
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

  async getSummary(
    summonerName: string,
    region: RegionAliasType = RegionAliasType.NA1,
    queueId: QueueIDType = QueueIDType.ALL,
  ): Promise<PageResponse<MatchSummaryDto>> {
    try {
      const summoner = await this.summonerService.getSummonerByNameAndRegion(
        summonerName,
        region,
      );

      let matchesSummaryList = await this.getMatches(
        summonerName,
        region,
        DEFAULT_PAGE_NO,
        DEFAULT_PAGE_SIZE,
        queueId,
      );

      let matchSummaryDtoList: MatchSummaryDto[] = [];
      return {
        results: matchSummaryDtoList,
        page: DEFAULT_PAGE_NO,
        pageSize: DEFAULT_PAGE_SIZE,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
