import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MiniSeriesDto {
  @Expose()
  @ApiProperty({
    description: 'Winning team on Summoners Rift.',
  })
  wins: number;

  @Expose()
  @ApiProperty({
    description: 'Losing team on Summoners Rift.',
  })
  losses: number;
  @Expose()
  @ApiProperty({
    description: 'Winning team on Summoners Rift.',
  })
  progress: string;

  @Expose()
  @ApiProperty({
    description: 'Losing team on Summoners Rift.',
  })
  target: number;
}
export class LeagueEntryDto {
  @Expose()
  @ApiProperty({ description: 'League Entry ID.' })
  leagueId: string;

  @Expose()
  @ApiProperty({
    description: "Player's encrypted summonerId.",
  })
  summonerId: string;

  @Expose()
  @ApiProperty({
    description: 'Summoner Name',
  })
  summonerName: string;

  @Expose()
  @ApiProperty({
    description: 'Summoner Name',
  })
  queueType: string;

  @Expose()
  @ApiProperty({
    description: 'Summoner Name',
  })
  tier: string;

  @Expose()
  @ApiProperty({
    description: "The player's division within a tier.",
  })
  rank: string;

  @Expose()
  @ApiProperty({
    description: "The player's division within a tier.",
  })
  leaguePoints: number;

  @Expose()
  @ApiProperty({
    description: 'Winning team on Summoners Rift.',
  })
  wins: number;

  @Expose()
  @ApiProperty({
    description: 'Losing team on Summoners Rift.',
  })
  losses: number;

  @Expose()
  @ApiProperty({
    description: '',
  })
  hotStreak: boolean;

  @Expose()
  @ApiProperty({
    description: '',
  })
  freshBlood: boolean;

  @Expose()
  @ApiProperty({
    description: '',
  })
  inactive: boolean;

  @Expose()
  @ApiProperty({
    description: '',
  })
  miniSeries: MiniSeriesDto;
}
