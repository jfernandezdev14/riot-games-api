import { ApiProperty } from '@nestjs/swagger';
import { QueueIDType } from '../../../modules/lol/lol.enum';

export class MatchSummaryDto {
  @ApiProperty({ description: 'Match id.' })
  matchId: string;

  @ApiProperty({ description: 'Champion Name' })
  championName: string;

  @ApiProperty({ description: 'Kills' })
  kills: number;

  @ApiProperty({ description: 'Deaths' })
  deaths: number;

  @ApiProperty({ description: 'Assists' })
  assists: number;

  @ApiProperty({ description: 'Kills/Deaths/Assists ratio' })
  kda: number;

  @ApiProperty({ description: 'Lane' })
  lane: string;

  @ApiProperty({ description: 'Time Played' })
  timePlayed: number;

  @ApiProperty({ description: 'Total Damage Dealt' })
  totalDamageDealt: number;

  @ApiProperty({ description: 'Total Damage Dealt To Champions' })
  totalDamageDealtToChampions: number;

  @ApiProperty({ description: 'Creep Score Per Minute' })
  cSPerMinute: number;

  @ApiProperty({ description: 'Win' })
  win: boolean;

  @ApiProperty({
    description:
      'Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.',
  })
  gameEndTimestamp: number;
}
export class TeamDto {}
export class ParticipantDto {
  @ApiProperty({ description: 'Champion Name' })
  championName: string;

  @ApiProperty({ description: 'Kills' })
  kills: number;

  @ApiProperty({ description: 'Deaths' })
  deaths: number;

  @ApiProperty({ description: 'Assists' })
  assists: number;

  @ApiProperty({ description: 'Lane' })
  lane: string;

  @ApiProperty({ description: 'Time Played' })
  timePlayed: number;

  @ApiProperty({ description: 'Total Damage Dealt' })
  totalDamageDealt: number;

  @ApiProperty({ description: 'Total Damage Dealt To Champions' })
  totalDamageDealtToChampions: number;

  @ApiProperty({ description: 'Win' })
  win: boolean;
}
export class MetadataDto {
  @ApiProperty({ description: 'Match data version.' })
  dataVersion: string;

  @ApiProperty({ description: 'Match id.' })
  matchId: string;

  @ApiProperty({ description: 'A list of participant PUUIDs.' })
  participants: string[];
}

export class InfoDto {
  @ApiProperty({
    description:
      'Unix timestamp for when the game is created on the game server (i.e., the loading screen).',
  })
  gameCreation: number;

  @ApiProperty({
    description:
      "Prior to patch 11.20, this field returns the game length in milliseconds calculated from gameEndTimestamp - gameStartTimestamp. Post patch 11.20, this field returns the max timePlayed of any participant in the game in seconds, which makes the behavior of this field consistent with that of match-v4. The best way to handling the change in this field is to treat the value as milliseconds if the gameEndTimestamp field isn't in the response and to treat the value as seconds if gameEndTimestamp is in the response.",
  })
  gameDuration: number;

  @ApiProperty({
    description:
      'Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.',
  })
  gameEndTimestamp: number;

  @ApiProperty({
    description: 'Game ID',
  })
  gameId: number;

  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
  })
  gameMode: string;

  @ApiProperty({
    description: 'Game Name',
  })
  gameName: string;

  @ApiProperty({
    description: 'Unix timestamp for when match starts on the game server.',
  })
  gameStartTimestamp: number;

  @ApiProperty({
    description: 'Game Type',
  })
  gameType: string;

  @ApiProperty({
    description:
      'The first two parts can be used to determine the patch a game was played on.',
  })
  gameVersion: string;

  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
  })
  mapId: number;

  @ApiProperty({
    description: 'List of Participants',
  })
  participants: ParticipantDto[];

  @ApiProperty({
    description: 'Platform where the match was played.',
  })
  platformId: string;

  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
    nullable: false,
    type: Number,
    enum: QueueIDType,
  })
  queueId: number;

  @ApiProperty({
    description: 'List of Teams',
  })
  teams: TeamDto[];

  @ApiProperty({
    description:
      'Tournament code used to generate the match. This field was added to match-v5 in patch 11.13 on June 23rd, 2021.',
  })
  tournamentCode: string;
}
export class MatchDto {
  @ApiProperty({
    description: 'Match metadata.',
  })
  metadata: MetadataDto;

  @ApiProperty({
    description: 'Match info.',
  })
  info: InfoDto;
}
