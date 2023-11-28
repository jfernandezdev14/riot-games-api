import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MatchSummaryService } from './match-summary.service';
import { MatchSummaryDao } from './match-summary.dao';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchSummary } from '../../../entities/MatchSummary.entity';
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([MatchSummary])],
  providers: [MatchSummaryService, MatchSummaryDao, ConfigService],
  controllers: [],
  exports: [MatchSummaryService],
})
export class MatchSummaryModule {}
