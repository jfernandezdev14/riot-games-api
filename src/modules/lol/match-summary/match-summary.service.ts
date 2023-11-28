import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { PageResponse } from '../../../constants/PageResponse';
import { MatchSummaryDao } from './match-summary.dao';
import { MatchSummary } from '../../../entities/MatchSummary.entity';

@Injectable()
export class MatchSummaryService {
  constructor(private readonly matchSummaryDao: MatchSummaryDao) {}

  async createMatchSummary(
    matchSummary: MatchSummary,
    matchId: string,
    playerId: string,
  ): Promise<MatchSummary> {
    return this.matchSummaryDao.saveMatchSummary({
      ...matchSummary,
      matchId,
      playerId,
    });
  }

  async updateRanking(
    matchSummary: MatchSummary,
    matchId: string,
    playerId: string,
  ): Promise<MatchSummary> {
    const existingMatchSummary =
      await this.matchSummaryDao.getMatchSummaryByUniqueId(matchId, playerId);
    if (!existingMatchSummary) {
      throw new NotFoundException(
        `match summary with matchId: ${matchId} and playerId: ${playerId} not found.`,
      );
    }
    return this.matchSummaryDao.saveMatchSummary(matchSummary);
  }

  async getMatchSummaryById(matchSummaryId: string): Promise<MatchSummary> {
    return this.matchSummaryDao.getMatchSummaryById(matchSummaryId);
  }

  async deleteMatchSummary(
    id: string,
    matchId: string,
    playerId: string,
  ): Promise<DeleteResult> {
    return this.matchSummaryDao.deleteMatchSummary(id, matchId, playerId);
  }

  async findMatchSummary(
    page: number,
    pageSize: number,
    searchCriteria: string,
    order: 'ASC' | 'DESC',
    orderBy: string,
  ): Promise<PageResponse<MatchSummary>> {
    return this.matchSummaryDao.find(
      page,
      pageSize,
      searchCriteria,
      order,
      orderBy,
    );
  }
}
