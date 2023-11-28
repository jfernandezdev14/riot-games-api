import { Module } from '@nestjs/common';

import { LolController } from './modules/lol/lol.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LolModule } from './modules/lol/lol.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
    }),
    LolModule,
  ],
  controllers: [LolController, AppController],
  providers: [AppService, ConfigService],
  exports: [AppService],
})
export class AppModule {}
