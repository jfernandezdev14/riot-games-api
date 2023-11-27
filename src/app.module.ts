import { Module, ValidationPipe } from '@nestjs/common';

import { LolController } from './modules/lol/lol.controller';
import { LolService } from './modules/lol/lol.service';
import { APP_PIPE } from '@nestjs/core';
import { SummonerModule } from './integrations/lol/summoner/summoner.module';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SummonerModule],
  controllers: [LolController, AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    LolService,
    AppService,
    ConfigService,
  ],
  exports: [LolService, AppService],
})
export class AppModule {}
