import { Injectable } from '@nestjs/common';
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
import { QueueIDType, RegionContinent } from './lol.enum';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class LolService {
  constructor(
    private summonerService: SummonerService,
    private matchService: MatchService,
    private readonly configService: ConfigService,
  ) {}
  async getMatches(
    summonerName: string,
    region: string,
    page: number = DEFAULT_PAGE_NO,
    pageSize: number = DEFAULT_PAGE_SIZE,
    queueId: QueueIDType = QueueIDType.ALL,
  ): Promise<PageResponse<MatchSummaryDto>> {
    const summoner = await this.summonerService.getSummonerByNameAndRegion(
      summonerName,
      region,
    );
    const startIndex = page * pageSize - 1;
    const currentTimeEpoch = Date.now();
    const matches = await this.matchService.findMatches(
      summoner.puuid,
      region,
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
      match.info.participants.forEach(
        (participant: ParticipantDto) => (participantDto = participant),
      );
      if (!participantDto) {
        participantDto = new ParticipantDto();
      }
      let totalPlayedInMinutes = ~~(participantDto.timePlayed / 60);
      let cSPerMinute =
        (participantDto.totalDamageDealt -
          participantDto.totalDamageDealtToChampions) /
        totalPlayedInMinutes;
      let kda =
        (participantDto.kills + participantDto.assists) / participantDto.deaths;
      let matchSummaryDto: MatchSummaryDto = {
        matchId: matchID,
        championName: participantDto.championName,
        kills: participantDto.kills,
        deaths: participantDto.deaths,
        assists: participantDto.assists,
        kda: kda,
        lane: participantDto.lane,
        timePlayed: participantDto.timePlayed,
        totalDamageDealt: participantDto.totalDamageDealt,
        totalDamageDealtToChampions: participantDto.totalDamageDealtToChampions,
        cSPerMinute: cSPerMinute,
        win: participantDto.win,
        gameEndTimestamp: match.info.gameEndTimestamp,
      };
      matchSummaryDtoList.push(matchSummaryDto);
    }
    return {
      results: matchSummaryDtoList,
      page: page,
      pageSize: pageSize,
    };
  }
}
