import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsDefined, IsInt, IsOptional, IsUUID, Length } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';
import { Auditable } from './Auditable.entity';
import { Player } from './Player.entity';

@Entity('ranking')
@Index(['summonerId', 'queueType', 'region'], { unique: true })
export class Ranking extends Auditable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Ranking ID',
  })
  id?: string;

  @Column({ name: 'summoner_id' })
  @IsDefined()
  @Length(1, 255)
  @ApiProperty({
    description: 'ID of the Summoner',
    minLength: 1,
    maxLength: 56,
  })
  summonerId: string;

  @Column({ name: 'summoner_name' })
  @IsDefined()
  @Length(1, 255)
  @ApiProperty({
    description: 'Name of the Summoner',
    minLength: 1,
    maxLength: 56,
  })
  summonerName: string;

  @Column()
  @IsDefined()
  @Length(2, 10)
  @ApiProperty({
    description: 'Region of the Summoner',
    minLength: 78,
    maxLength: 78,
  })
  region: string;

  @Column({ name: 'tier' })
  @IsDefined()
  @Length(2, 255)
  @ApiProperty({ description: 'Summoner tier.', minLength: 2, maxLength: 255 })
  tier: string;

  @Column({ name: 'rank' })
  @IsDefined()
  @Length(2, 255)
  @ApiProperty({ description: 'Summoner rank.', minLength: 2, maxLength: 255 })
  rank: string;

  @Column({ name: 'league_points' })
  @IsDefined()
  @ApiProperty({ description: 'Summoner League Points.' })
  leaguePoints: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Summoner kills.' })
  kills: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Summoner deaths.' })
  deaths: number;

  @Column()
  @IsDefined()
  @ApiProperty({ description: 'Summoner assists.' })
  assists: number;

  @Column({ type: 'decimal', nullable: true })
  @IsDefined()
  @ApiProperty({ description: 'Kills/Deaths/Assists ratio' })
  kda: number;

  @Column({ type: 'decimal', name: 'win_rate', nullable: true })
  @IsOptional()
  @ApiProperty({ description: 'Win Rate' })
  winRate: number;

  @Column({ type: 'decimal', name: 'avg_vision_score' })
  @IsDefined()
  @ApiProperty({ description: 'Summoner average Vision Score.' })
  avgVisionScore: number;

  @Column({ type: 'decimal', name: 'avg_cs_per_minute' })
  @IsDefined()
  @ApiProperty({ description: 'Summoner average Creep Score Per Minute.' })
  avgCSPerMinute: number;

  @Column({ name: 'summoner_level' })
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Summoner level associated with the summoner.',
  })
  summonerLevel?: number;

  @Column({ name: 'queue_id' })
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Queue Identifier',
  })
  queueId?: number;

  @Column({ name: 'queue_type' })
  @IsDefined()
  @ApiPropertyOptional({
    description: 'Queue Type Name',
  })
  queueType?: string;

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
