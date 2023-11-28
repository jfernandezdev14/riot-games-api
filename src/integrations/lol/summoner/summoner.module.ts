import { Module } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [HttpModule],
  providers: [SummonerService, ConfigService],
  controllers: [],
  exports: [SummonerService],
})
export class SummonerModule {}
