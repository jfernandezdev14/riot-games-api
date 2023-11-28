import { Injectable } from '@nestjs/common';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageResponse } from '../../../constants/PageResponse';
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
} from '../../../constants/DefaultPageParams';
import { MatchSummary } from '../../../entities/MatchSummary.entity';

@Injectable()
export class MatchSummaryDao {
  constructor(
    @InjectRepository(MatchSummary)
    private readonly repository: Repository<MatchSummary>,
  ) {}

  async saveMatchSummary(matchSummary: MatchSummary): Promise<MatchSummary> {
    return this.repository.save(matchSummary);
  }

  async getMatchSummaryById(id: string): Promise<MatchSummary> {
    return this.repository
      .createQueryBuilder('match_summary')
      .where('match_summary.id = :id', { id })
      .getOne();
  }

  async getMatchSummaryByUniqueId(
    matchId: string,
    playerId: string,
  ): Promise<MatchSummary> {
    return this.repository
      .createQueryBuilder('match_summary')
      .where('match_summary.match_id = :matchId', { matchId })
      .andWhere('match_summary.player_id = :playerId', { playerId })
      .getOne();
  }

  async find(
    page = DEFAULT_PAGE_NO,
    pageSize = DEFAULT_PAGE_SIZE,
    searchCriteria: string,
    order: 'ASC' | 'DESC',
    orderBy: string,
  ): Promise<PageResponse<MatchSummary>> {
    const query = this.repository.createQueryBuilder('match_summary');

    if (searchCriteria) {
      query.where(
        new Brackets((qb) => {
          qb.where('match_summary.id ILIKE :searchCriteria', {
            searchCriteria: `%${searchCriteria}%`,
          });

          ['match_id', 'summoner_name', 'champion_name', 'player_id'].forEach(
            (column) => {
              qb.orWhere(`match_summary.${column} ILIKE :searchCriteria`, {
                searchCriteria: `%${searchCriteria}%`,
              });
            },
          );
        }),
      );
    }

    const [matchSummary, total] = await query
      .orderBy(`match_summary.${orderBy}`, order)
      .skip(pageSize && page ? pageSize * (page - 1) : 0)
      .take(pageSize || 0)
      .getManyAndCount();

    return {
      results: matchSummary,
      page: page,
      pageSize: pageSize,
      total,
    };
  }

  async deleteMatchSummary(
    id: string,
    matchId: string,
    playerId: string,
  ): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(MatchSummary)
      .where('id = :id', { id })
      .andWhere('match_id = :matchId', { matchId })
      .andWhere('player_id = :playerId', { playerId })
      .execute();
  }
}
