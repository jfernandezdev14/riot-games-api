import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { MatchDto } from './match.dto';
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
} from '../../../constants/DefaultPageParams';
import { QueueIDType } from '../../../modules/lol/lol.enum';

@Injectable()
export class MatchService {
  private readonly RIOT_GAMES_API_HOST: string;
  private readonly URL_PROTOCOL: string;

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private riotAPIKey: string,
  ) {
    this.RIOT_GAMES_API_HOST = configService.get('RIOT_GAMES_API_HOST');
    this.URL_PROTOCOL = configService.get('URL_PROTOCOL');
    this.riotAPIKey = configService.get('RIOT_GAMES_DEVELOPER_API_KEY');
  }

  async getMatchByID(matchId: string, region: string): Promise<MatchDto> {
    const url = `${this.URL_PROTOCOL}${region}.${this.RIOT_GAMES_API_HOST}${SUMMONER_BY_NAME}/${name}`;
    const headers = {
      'X-Riot-Token': this.riotAPIKey,
    };
    const response = await firstValueFrom(
      this.httpService.get(url, { headers: headers }),
    );
    return plainToInstance(MatchDto, response.data, {
      excludeExtraneousValues: true,
    });
  }

  async findMatches(
    puuid: string,
    region: string,
    start: number,
    count: number,
    queueId: number,
    endTime: number,
  ): Promise<string[]> {
    const url = `${this.URL_PROTOCOL}${region}.${this.RIOT_GAMES_API_HOST}${SUMMONER_BY_NAME}/${name}`;
    const headers = {
      'X-Riot-Token': this.riotAPIKey,
    };
    const response = await firstValueFrom(
      this.httpService.get(url, { headers: headers }),
    );
    return response.data;
  }
}
