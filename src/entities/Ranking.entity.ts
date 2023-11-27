import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsDefined, IsInt, IsOptional, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Auditable } from './Auditable.entity';

@Entity('summoner')
export class Summoner extends Auditable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Ranking ID',
  })
  id?: string;

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

  @Column({ name: 'created_at' })
  @IsDefined()
  @Length(2, 255)
  @ApiProperty({ description: 'Summoner name.', minLength: 2, maxLength: 255 })
  leaguePoints: string;

  @Column()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'ID of the summoner icon associated with the summoner.',
  })
  profileIconId?: number;

  @Column()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Summoner level associated with the summoner.',
  })
  summonerLevel?: number;

  @Column()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description:
      'Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.',
  })
  revisionDate?: number;
}
