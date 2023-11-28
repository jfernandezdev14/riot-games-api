import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { IsDefined, IsInt, IsOptional, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Auditable } from './Auditable.entity';

@Entity('player')
@Index(['summonerId', 'name', 'puuid'], { unique: true })
export class Player extends Auditable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Player ID',
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

  @Column({ name: 'puuid' })
  @IsDefined()
  @Length(1, 255)
  @ApiProperty({
    description: 'PUUID of the Summoner',
    minLength: 1,
    maxLength: 56,
  })
  puuid: string;

  @Column()
  @IsDefined()
  @Length(1, 255)
  @ApiProperty({
    description: 'Name of the Summoner',
    minLength: 1,
    maxLength: 56,
  })
  name: string;

  @Column()
  @IsDefined()
  @Length(2, 10)
  @ApiProperty({
    description: 'Region of the Summoner',
    minLength: 78,
    maxLength: 78,
  })
  region: string;
}
