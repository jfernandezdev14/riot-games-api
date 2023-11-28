import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { PlayerDao } from './player.dao';
import { Player } from '../../../entities/Player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Player])],
  providers: [PlayerService, PlayerDao, ConfigService],
  controllers: [],
  exports: [PlayerService],
})
export class PlayerModule {}
