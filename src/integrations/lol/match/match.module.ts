import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MatchService } from './match.service';
@Module({
  imports: [HttpModule],
  providers: [MatchService, ConfigService],
  controllers: [],
  exports: [MatchService],
})
export class MatchModule {}
