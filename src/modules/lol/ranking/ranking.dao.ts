import { Injectable } from '@nestjs/common';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from '../../../entities/Ranking.entity';
import { PageResponse } from '../../../constants/PageResponse';
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
} from '../../../constants/DefaultPageParams';

@Injectable()
export class RankingDao {
  constructor(
    @InjectRepository(Ranking)
    private readonly repository: Repository<Ranking>,
  ) {}

  async saveRanking(ranking: Ranking): Promise<Ranking> {
    return this.repository.save(ranking);
  }

  async getRankingById(id: string): Promise<Ranking> {
    return this.repository
      .createQueryBuilder('ranking')
      .where('ranking.id = :id', { id })
      .getOne();
  }

  async getRankingByUniqueId(
    summonerId: string,
    queueType: string,
    region: string,
  ): Promise<Ranking> {
    return this.repository
      .createQueryBuilder('ranking')
      .where('ranking.summoner_id = :summonerId', { summonerId })
      .andWhere('ranking.queue_type = :queueType', { queueType })
      .andWhere('ranking.region = :region', { region })
      .getOne();
  }

  async find(
    page = DEFAULT_PAGE_NO,
    pageSize = DEFAULT_PAGE_SIZE,
    searchCriteria: string,
    order: 'ASC' | 'DESC',
    orderBy: string,
  ): Promise<PageResponse<Ranking>> {
    const query = this.repository.createQueryBuilder('ranking');

    if (searchCriteria) {
      query.where(
        new Brackets((qb) => {
          qb.where('ranking.summoner_name ILIKE :searchCriteria', {
            searchCriteria: `%${searchCriteria}%`,
          });

          ['region', 'summoner_id', 'rank', 'queue_type'].forEach((column) => {
            qb.orWhere(`ranking.${column} ILIKE :searchCriteria`, {
              searchCriteria: `%${searchCriteria}%`,
            });
          });
        }),
      );
    }

    const [rankings, total] = await query
      .orderBy(`ranking.${orderBy}`, order)
      .skip(pageSize && page ? pageSize * (page - 1) : 0)
      .take(pageSize || 0)
      .getManyAndCount();

    return {
      results: rankings,
      page: page,
      pageSize: pageSize,
      total,
    };
  }

  async deleteRanking(
    id: string,
    summonerId: string,
    queueType: string,
    region: string,
  ): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(Ranking)
      .where('id = :id', { id })
      .andWhere('summoner_id = :summonerId', { summonerId })
      .andWhere('queue_type = :queueType', { queueType })
      .andWhere('region = :region', { region })
      .execute();
  }
}
