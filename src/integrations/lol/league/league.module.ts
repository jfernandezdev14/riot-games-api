import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LeagueService } from './league.service';
@Module({
  imports: [HttpModule],
  providers: [LeagueService, ConfigService],
  controllers: [],
  exports: [LeagueService],
})
export class LeagueModule {}
