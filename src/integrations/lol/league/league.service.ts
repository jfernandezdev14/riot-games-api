import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { LeagueEntryDto } from './league.dto';
import { ENTRIES_BY_SUMMONER_ID } from '../../../constants/IntegrationURLS';
import { QueueIDType, RegionAliasType } from '../../../modules/lol/lol.enum';

@Injectable()
export class LeagueService {
  private readonly RIOT_GAMES_API_HOST: string;
  private readonly URL_PROTOCOL: string;
  private readonly riotAPIKey: string;
  private readonly logger = new Logger(LeagueService.name);
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.RIOT_GAMES_API_HOST = configService.get('RIOT_GAMES_API_HOST');
    this.URL_PROTOCOL = configService.get('URL_PROTOCOL');
    this.riotAPIKey = configService.get('RIOT_GAMES_DEVELOPER_API_KEY');
  }

  async getLeagueEntriesBySummonerID(
    summonerId: string,
    region: RegionAliasType = RegionAliasType.NA1,
  ): Promise<LeagueEntryDto[]> {
    try {
      const url = `${this.URL_PROTOCOL}${region}.${this.RIOT_GAMES_API_HOST}${ENTRIES_BY_SUMMONER_ID}/${summonerId}`;
      const headers = {
        'X-Riot-Token': this.riotAPIKey,
      };
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: headers }),
      );
      let leagueEntryDtoList: LeagueEntryDto[] = [];
      if (response.data.length > 0) {
        response.data.forEach((leagueEntry) => {
          let leagueEntryDto = plainToInstance(LeagueEntryDto, leagueEntry, {
            excludeExtraneousValues: true,
          });
          leagueEntryDtoList.push(leagueEntryDto);
        });
      }

      return leagueEntryDtoList;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
