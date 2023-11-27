import { ApiProperty } from '@nestjs/swagger';

export class SummonerDto {
  @ApiProperty({
    description: 'Encrypted summoner ID. Max length 63 characters.',
  })
  id: string;

  @ApiProperty({
    description: 'Encrypted account ID. Max length 56 characters.',
  })
  accountId: string;

  @ApiProperty({
    description: 'Encrypted PUUID. Exact length of 78 characters.',
  })
  puuid: string;

  @ApiProperty({
    description: 'Summoner name.',
  })
  name: string;

  @ApiProperty({
    description: 'ID of the summoner icon associated with the summoner.',
  })
  profileIconId: number;

  @ApiProperty({
    description:
      'Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.',
  })
  revisionDate: number;

  @ApiProperty({
    description: 'Summoner level associated with the summoner.',
  })
  summonerLevel: number;
}
