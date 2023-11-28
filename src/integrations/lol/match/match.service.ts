import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { MatchDto } from './match.dto';
import {
  MATCHES_BY_ID,
  MATCHES_BY_PUUID,
} from '../../../constants/IntegrationURLS';

@Injectable()
export class MatchService {
  private readonly RIOT_GAMES_API_HOST: string;
  private readonly URL_PROTOCOL: string;
  private readonly riotAPIKey: string;
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.RIOT_GAMES_API_HOST = configService.get('RIOT_GAMES_API_HOST');
    this.URL_PROTOCOL = configService.get('URL_PROTOCOL');
    this.riotAPIKey = configService.get('RIOT_GAMES_DEVELOPER_API_KEY');
  }

  async getMatchByID(matchId: string, region: string): Promise<MatchDto> {
    const url = `${this.URL_PROTOCOL}${region}.${this.RIOT_GAMES_API_HOST}${MATCHES_BY_ID}/${matchId}`;
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
    try {
      const baseUrl = `${this.URL_PROTOCOL}${region}.${this.RIOT_GAMES_API_HOST}${MATCHES_BY_PUUID}/${puuid}/ids`;
      let queryStr = `start=${start}&count=${count}&endTime=${endTime}`;
      if (queueId != null && queueId != 0) {
        queryStr = `${queryStr}&queue=${queueId}`;
      }
      const headers = {
        'X-Riot-Token': this.riotAPIKey,
      };
      const url = `${baseUrl}?${queryStr}`;
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: headers }),
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
