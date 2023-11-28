import { ApiProperty } from '@nestjs/swagger';
import { QueueIDType } from '../../../modules/lol/lol.enum';
import { Expose } from 'class-transformer';

export class MatchSummaryDto {
  @Expose()
  @ApiProperty({ description: 'Match id.' })
  matchId: string;

  @Expose()
  @ApiProperty({
    description: 'Summoner Name',
  })
  summonerName: string;

  @Expose()
  @ApiProperty({ description: 'Champion Name' })
  championName: string;

  @Expose()
  @ApiProperty({ description: 'Kills' })
  kills: number;

  @Expose()
  @ApiProperty({ description: 'Deaths' })
  deaths: number;

  @Expose()
  @ApiProperty({ description: 'Assists' })
  assists: number;

  @Expose()
  @ApiProperty({ description: 'Kills/Deaths/Assists ratio' })
  kda: number;

  @Expose()
  @ApiProperty({ description: 'Lane' })
  lane: string;

  @Expose()
  @ApiProperty({ description: 'Time Played' })
  timePlayed: number;

  @Expose()
  @ApiProperty({ description: 'True Damage Dealt' })
  trueDamageDealt: number;

  @Expose()
  @ApiProperty({ description: 'Total Damage Dealt To Champions' })
  trueDamageDealtToChampions: number;

  @Expose()
  @ApiProperty({ description: 'Creep Score Per Minute' })
  cSPerMinute: number;

  @Expose()
  @ApiProperty({ description: 'Win' })
  win: boolean;

  @Expose()
  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
    nullable: false,
    type: Number,
    enum: QueueIDType,
  })
  queueId: number;

  @Expose()
  @ApiProperty({
    description:
      'Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.',
  })
  gameEndTimestamp: number;
}
export class TeamDto {}
export class ParticipantDto {
  @Expose()
  @ApiProperty({
    description: 'Summoner PUUID',
  })
  puuid: string;

  @Expose()
  @ApiProperty({
    description: 'Summoner Name',
  })
  summonerName: string;

  @Expose()
  @ApiProperty({ description: 'Champion Name' })
  championName: string;

  @Expose()
  @ApiProperty({ description: 'Kills' })
  kills: number;

  @Expose()
  @ApiProperty({ description: 'Deaths' })
  deaths: number;

  @Expose()
  @ApiProperty({ description: 'Assists' })
  assists: number;

  @Expose()
  @ApiProperty({ description: 'Lane' })
  lane: string;

  @Expose()
  @ApiProperty({ description: 'Time Played' })
  timePlayed: number;

  @Expose()
  @ApiProperty({ description: 'True Damage Dealt' })
  trueDamageDealt: number;

  @Expose()
  @ApiProperty({ description: 'True Damage Dealt To Champions' })
  trueDamageDealtToChampions: number;

  @Expose()
  @ApiProperty({ description: 'Win' })
  win: boolean;
}
export class MetadataDto {
  @Expose()
  @ApiProperty({ description: 'Match data version.' })
  dataVersion: string;

  @Expose()
  @ApiProperty({ description: 'Match id.' })
  matchId: string;

  @Expose()
  @ApiProperty({ description: 'A list of participant PUUIDs.' })
  participants: string[];
}

export class InfoDto {
  @Expose()
  @ApiProperty({
    description:
      'Unix timestamp for when the game is created on the game server (i.e., the loading screen).',
  })
  gameCreation: number;

  @Expose()
  @ApiProperty({
    description:
      "Prior to patch 11.20, this field returns the game length in milliseconds calculated from gameEndTimestamp - gameStartTimestamp. Post patch 11.20, this field returns the max timePlayed of any participant in the game in seconds, which makes the behavior of this field consistent with that of match-v4. The best way to handling the change in this field is to treat the value as milliseconds if the gameEndTimestamp field isn't in the response and to treat the value as seconds if gameEndTimestamp is in the response.",
  })
  gameDuration: number;

  @Expose()
  @ApiProperty({
    description:
      'Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.',
  })
  gameEndTimestamp: number;

  @Expose()
  @ApiProperty({
    description: 'Game ID',
  })
  gameId: number;

  @Expose()
  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
  })
  gameMode: string;

  @Expose()
  @ApiProperty({
    description: 'Game Name',
  })
  gameName: string;

  @Expose()
  @ApiProperty({
    description: 'Unix timestamp for when match starts on the game server.',
  })
  gameStartTimestamp: number;

  @Expose()
  @ApiProperty({
    description: 'Game Type',
  })
  gameType: string;

  @Expose()
  @ApiProperty({
    description:
      'The first two parts can be used to determine the patch a game was played on.',
  })
  gameVersion: string;

  @Expose()
  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
  })
  mapId: number;

  @Expose()
  @ApiProperty({
    description: 'List of Participants',
  })
  participants: ParticipantDto[];

  @Expose()
  @ApiProperty({
    description: 'Platform where the match was played.',
  })
  platformId: string;

  @Expose()
  @ApiProperty({
    description: 'Refer to the Game Constants documentation.',
    nullable: false,
    type: Number,
    enum: QueueIDType,
  })
  queueId: number;

  @Expose()
  @ApiProperty({
    description: 'List of Teams',
  })
  teams: TeamDto[];

  @Expose()
  @ApiProperty({
    description:
      'Tournament code used to generate the match. This field was added to match-v5 in patch 11.13 on June 23rd, 2021.',
  })
  tournamentCode: string;
}
export class MatchDto {
  @Expose()
  @ApiProperty({
    description: 'Match metadata.',
  })
  metadata: MetadataDto;

  @Expose()
  @ApiProperty({
    description: 'Match info.',
  })
  info: InfoDto;
}
