import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Auditable } from './Auditable.entity';
import { QueueIDType } from '../modules/lol/lol.enum';
import { Player } from './Player.entity';

@Entity('match_summary')
@Index(['matchId', 'player'], { unique: true })
export class MatchSummary extends Auditable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Match Summary UUID',
  })
  id?: string;

  @Column({ name: 'match_id' })
  @IsDefined()
  @ApiProperty({ description: 'Match ID' })
  matchId: string;

  @Column({ name: 'summoner_name' })
  @IsDefined()
  @Length(1, 255)
  @ApiProperty({
    description: 'Name of the Summoner',
    minLength: 1,
    maxLength: 56,
  })
  summonerName: string;

  @Column({ name: 'champion_name' })
  @IsDefined()
  @Length(1, 255)
  @ApiProperty({
    description: 'Champion Name',
    minLength: 1,
    maxLength: 56,
  })
  championName: string;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Kills.' })
  kills: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Deaths' })
  deaths: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Assists' })
  assists: number;

  @Column()
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Kills/Deaths/Assists ratio' })
  kda: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Lane' })
  lane: string;

  @Column({ name: 'time_played' })
  @IsDefined()
  @ApiProperty({ description: 'Time Played' })
  timePlayed: number;

  @Column({ name: 'true_damage_dealt' })
  @IsDefined()
  @ApiProperty({ description: 'True Damage Dealt' })
  trueDamageDealt: number;

  @Column({ name: 'true_damage_dealt_to_champions' })
  @IsDefined()
  @ApiProperty({ description: 'Total Damage Dealt To Champions' })
  trueDamageDealtToChampions: number;

  @Column('decimal', { precision: 6, scale: 2, name: 'cs_per_minute' })
  @IsDefined()
  @IsNumber()
  @ApiProperty({ description: 'Creep Score Per Minute' })
  cSPerMinute: number;

  @Column('decimal', { precision: 6, scale: 2, name: 'vision_score' })
  @IsDefined()
  @ApiProperty({ description: 'Vision Score' })
  visionScore: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Win' })
  win: boolean;

  @Column({ name: 'queue_id' })
  @IsDefined()
  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
    nullable: false,
    type: Number,
    enum: QueueIDType,
  })
  queueId: number;

  @Column({ type: 'bigint', name: 'game_end_timestamp' })
  @IsDefined()
  @ApiProperty({
    description:
      'Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.',
  })
  gameEndTimestamp: number;

  @Column({ name: 'player_id' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Player ID',
  })
  playerId?: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  @ApiHideProperty()
  player?: Player;
}
