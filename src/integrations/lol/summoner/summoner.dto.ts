import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SummonerDto {
  @Expose()
  @ApiProperty({
    description: 'Encrypted summoner ID. Max length 63 characters.',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Encrypted account ID. Max length 56 characters.',
  })
  accountId: string;

  @Expose()
  @ApiProperty({
    description: 'Encrypted PUUID. Exact length of 78 characters.',
  })
  puuid: string;

  @Expose()
  @ApiProperty({
    description: 'Summoner name.',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'ID of the summoner icon associated with the summoner.',
  })
  profileIconId: number;

  @Expose()
  @ApiProperty({
    description:
      'Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.',
  })
  revisionDate: number;

  @Expose()
  @ApiProperty({
    description: 'Summoner level associated with the summoner.',
  })
  summonerLevel: number;
}
