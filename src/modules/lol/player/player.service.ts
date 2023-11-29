import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { PageResponse } from '../../../constants/PageResponse';
import { PlayerDao } from './player.dao';
import { Player } from '../../../entities/Player.entity';

@Injectable()
export class PlayerService {
  constructor(private readonly playerDao: PlayerDao) {}

  async createPlayer(player: Player): Promise<Player> {
    return this.playerDao.savePlayer(player);
  }

  async updatePlayer(
    player: Player,
    summonerId: string,
    name: string,
    puuid: string,
  ): Promise<Player> {
    const existingPlayer = await this.playerDao.getPlayerByUniqueId(
      summonerId,
      name,
      puuid,
    );
    if (!existingPlayer) {
      throw new NotFoundException(
        `player with summonerId: ${summonerId}, name: ${name} and puuid: ${puuid} not found.`,
      );
    }
    return this.playerDao.savePlayer(player);
  }

  async getPlayerById(playerId: string): Promise<Player> {
    return this.playerDao.getPlayerById(playerId);
  }

  async getPlayerByNameAndRegion(
    name: string,
    region: string,
  ): Promise<Player> {
    return await this.playerDao.getPlayerByNameAndRegion(name, region);
  }

  async getPlayerByUniqueId(
    summonerId: string,
    name: string,
    puuid: string,
  ): Promise<Player> {
    const player = await this.playerDao.getPlayerByUniqueId(
      summonerId,
      name,
      puuid,
    );
    if (!player) {
      throw new NotFoundException(
        `player with summonerId: ${summonerId}, name: ${name} and puuid: ${puuid} not found.`,
      );
    }
    return player;
  }

  async deletePlayer(
    id: string,
    summonerId: string,
    name: string,
    puuid: string,
  ): Promise<DeleteResult> {
    return this.playerDao.deletePlayer(id, summonerId, name, puuid);
  }

  async findPlayer(
    page: number,
    pageSize: number,
    searchCriteria: string,
    order: 'ASC' | 'DESC',
    orderBy: string,
  ): Promise<PageResponse<Player>> {
    return this.playerDao.find(page, pageSize, searchCriteria, order, orderBy);
  }
}
