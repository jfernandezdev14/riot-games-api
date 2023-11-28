import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RankingService } from './ranking.service';
import { RankingDao } from './ranking.dao';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from '../../../entities/Ranking.entity';
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Ranking])],
  providers: [RankingService, RankingDao, ConfigService],
  controllers: [],
  exports: [RankingService],
})
export class RankingModule {}
