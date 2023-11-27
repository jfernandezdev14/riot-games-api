import { SummonerDto } from './summoner.dto';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SummonerService {
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

  async getSummonerByNameAndRegion(
    name: string,
    region: string,
  ): Promise<SummonerDto> {
    const url = `${this.URL_PROTOCOL}${region}.${this.RIOT_GAMES_API_HOST}${SUMMONER_BY_NAME}/${name}`;
    const headers = {
      'X-Riot-Token': this.riotAPIKey,
    };
    const response = await firstValueFrom(
      this.httpService.get(url, { headers: headers }),
    );
    return plainToInstance(SummonerDto, response.data, {
      excludeExtraneousValues: true,
    });
  }
}
