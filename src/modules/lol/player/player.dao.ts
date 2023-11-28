import { Injectable } from '@nestjs/common';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageResponse } from '../../../constants/PageResponse';
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
} from '../../../constants/DefaultPageParams';
import { Player } from '../../../entities/Player.entity';

@Injectable()
export class PlayerDao {
  constructor(
    @InjectRepository(Player)
    private readonly repository: Repository<Player>,
  ) {}

  async savePlayer(player: Player): Promise<Player> {
    return this.repository.save(player);
  }

  async getPlayerById(id: string): Promise<Player> {
    return this.repository
      .createQueryBuilder('player')
      .where('player.id = :id', { id })
      .getOne();
  }

  async getPlayerByUniqueId(
    summonerId: string,
    name: string,
    puuid: string,
  ): Promise<Player> {
    return this.repository
      .createQueryBuilder('player')
      .where('player.summoner_id = :summonerId', { summonerId })
      .andWhere('player.name = :name', { name })
      .andWhere('player.puuid = :puuid', { puuid })
      .getOne();
  }

  async find(
    page = DEFAULT_PAGE_NO,
    pageSize = DEFAULT_PAGE_SIZE,
    searchCriteria: string,
    order: 'ASC' | 'DESC',
    orderBy: string,
  ): Promise<PageResponse<Player>> {
    const query = this.repository.createQueryBuilder('player');

    if (searchCriteria) {
      query.where(
        new Brackets((qb) => {
          qb.where('player.id ILIKE :searchCriteria', {
            searchCriteria: `%${searchCriteria}%`,
          });

          ['name', 'summoner_id', 'puuid'].forEach((column) => {
            qb.orWhere(`player.${column} ILIKE :searchCriteria`, {
              searchCriteria: `%${searchCriteria}%`,
            });
          });
        }),
      );
    }

    const [players, total] = await query
      .orderBy(`player.${orderBy}`, order)
      .skip(pageSize && page ? pageSize * (page - 1) : 0)
      .take(pageSize || 0)
      .getManyAndCount();

    return {
      results: players,
      page: page,
      pageSize: pageSize,
      total,
    };
  }

  async deletePlayer(
    id: string,
    summonerId: string,
    name: string,
    puuid: string,
  ): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(Player)
      .where('id = :id', { id })
      .andWhere('summoner_id = :summonerId', { summonerId })
      .andWhere('name = :name', { name })
      .andWhere('puuid = :puuid', { puuid })
      .execute();
  }
}
