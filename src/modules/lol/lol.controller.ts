import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LolService } from './lol.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageResponse } from '../../constants/PageResponse';
import { MatchSummaryDto } from '../../integrations/lol/match/match.dto';
import { QueueIDType, QueueNamesType, RegionAliasType } from './lol.enum';
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
} from '../../constants/DefaultPageParams';
import { Ranking } from '../../entities/Ranking.entity';

@Controller('/lol')
@ApiTags('LeagueOfLegends')
export class LolController {
  constructor(private readonly lolService: LolService) {}

  @Get('/regions/:region/summoners/:summonerName/matches')
  @ApiOperation({
    summary: 'Get Summoner recent matches by its name and region',
  })
  @ApiParam({
    name: 'region',
    required: true,
    type: String,
    enum: RegionAliasType,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({
    name: 'queueName',
    required: false,
    type: String,
    enum: QueueNamesType,
    enumName: 'Queue Name Filter',
  })
  async getMatches(
    @Param('region', new ParseEnumPipe(RegionAliasType))
    region: RegionAliasType,
    @Param('summonerName') summonerName: string,
    @Query(
      'page',
      new DefaultValuePipe(DEFAULT_PAGE_NO),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(DEFAULT_PAGE_SIZE),
      new ParseIntPipe({ optional: true }),
    )
    pageSize?: number,
    @Query(
      'queueName',
      new DefaultValuePipe(QueueNamesType.ALL),
      new ParseEnumPipe(QueueNamesType),
    )
    queueName?: QueueNamesType,
  ): Promise<PageResponse<MatchSummaryDto>> {
    let queueId = QueueIDType[queueName];
    return await this.lolService.getMatches(
      summonerName,
      region,
      page,
      pageSize,
      queueId,
    );
  }

  @Get('/regions/:region/summoners/:summonerName/summary')
  @ApiOperation({
    summary: 'Get Summoner matches summary',
  })
  @ApiParam({
    name: 'region',
    required: true,
    type: String,
    enum: RegionAliasType,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'queueName',
    required: false,
    type: String,
    enum: QueueNamesType,
    enumName: 'Queue Name Filter',
  })
  async getPlayerSummary(
    @Param('region', new ParseEnumPipe(RegionAliasType))
    region: RegionAliasType,
    @Param('summonerName') summonerName: string,
    @Query(
      'queueName',
      new DefaultValuePipe(QueueNamesType.ALL),
      new ParseEnumPipe(QueueNamesType),
    )
    queueName?: QueueNamesType,
  ): Promise<Ranking[]> {
    let queueId = QueueIDType[queueName];
    return await this.lolService.getPlayerSummary(
      summonerName,
      region,
      queueId,
    );
  }

  @Get('regions/:region/summoners/:summonerName/leaderboard')
  @ApiOperation({
    summary: 'Get leaderboard ranking positions',
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'region',
    required: true,
    type: String,
    enum: RegionAliasType,
  })
  async getLeaderBoardRanking(
    @Param('region', new ParseEnumPipe(RegionAliasType))
    region: RegionAliasType,
    @Param('summonerName') summonerName: string,
  ): Promise<any> {
    return await this.lolService.getLeaderBoardRanking(summonerName, region);
  }
}
