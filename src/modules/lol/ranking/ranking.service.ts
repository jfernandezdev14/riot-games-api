import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { RankingDao } from './ranking.dao';
import { Ranking } from '../../../entities/Ranking.entity';
import { PageResponse } from '../../../constants/PageResponse';

@Injectable()
export class RankingService {
  constructor(private readonly rankingDao: RankingDao) {}

  async createRanking(
    ranking: Ranking,
    summonerId: string,
    summonerName: string,
    queueType: string,
  ): Promise<Ranking> {
    return this.rankingDao.saveRanking({
      ...ranking,
      summonerId,
      summonerName,
      queueType,
    });
  }

  async updateRanking(
    ranking: Ranking,
    summonerId: string,
    queueType: string,
    region: string,
  ): Promise<Ranking> {
    const existingRanking = await this.rankingDao.getRankingByUniqueId(
      summonerId,
      queueType,
      region,
    );
    if (!existingRanking) {
      throw new NotFoundException(
        `ranking with summonerId: ${summonerId}, queueType: ${queueType} and region: ${region} not found.`,
      );
    }
    return this.rankingDao.saveRanking(ranking);
  }

  async getRankingById(rakingId: string): Promise<Ranking> {
    return this.rankingDao.getRankingById(rakingId);
  }

  async deleteRanking(
    id: string,
    summonerId: string,
    queueType: string,
    region: string,
  ): Promise<DeleteResult> {
    return this.rankingDao.deleteRanking(id, summonerId, queueType, region);
  }

  async findRanking(
    page: number,
    pageSize: number,
    searchCriteria: string,
    order: 'ASC' | 'DESC',
    orderBy: string,
  ): Promise<PageResponse<Ranking>> {
    return this.rankingDao.find(page, pageSize, searchCriteria, order, orderBy);
  }
}
