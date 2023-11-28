import { Module, ValidationPipe } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RankingModule } from './ranking/ranking.module';
import { LolController } from './lol.controller';
import { APP_PIPE } from '@nestjs/core';
import { LolService } from './lol.service';
import { MatchSummaryModule } from './match-summary/match-summary.module';
import { PlayerModule } from './player/player.module';
import { SummonerModule } from '../../integrations/lol/summoner/summoner.module';
import { MatchModule } from '../../integrations/lol/match/match.module';
import { LeagueModule } from '../../integrations/lol/league/league.module';
@Module({
  imports: [
    RankingModule,
    PlayerModule,
    MatchSummaryModule,
    SummonerModule,
    MatchModule,
    LeagueModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [LolController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    LolService,
    ConfigService,
  ],
  exports: [LolService],
})
export class LolModule {}
