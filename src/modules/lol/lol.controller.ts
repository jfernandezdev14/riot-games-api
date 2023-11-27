import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { LolService } from './lol.service';
import { ApiTags } from '@nestjs/swagger';
import { PageResponse } from '../../constants/PageResponse';
import { MatchSummaryDto } from '../../integrations/lol/match/match.dto';

@Controller('/lol')
@ApiTags('LeagueOfLegends')
export class LolController {
  constructor(private readonly lolService: LolService) {}

  @Get('/summoner/:summonerName/region/:region/matches')
  async getMatches(
    @Param('summonerName', ParseUUIDPipe) summonerName: string,
    @Param('region', ParseUUIDPipe) region: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<PageResponse<MatchSummaryDto>> {
    return this.lolService.getMatches(summonerName, region, page, pageSize);
  }
}
