import type { Ranking, User } from '@generated/prisma/client';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { EditionsService } from '@modules/editions/editions.service';

type RankingWithUser = Ranking & { user: User };
type RankingResponse = ReturnType<RankingService['formatRankings']>;

@Injectable()
export class RankingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly editionsService: EditionsService,
  ) {}

  async getUserPosition(userId: string, editionId: string) {
    const userRanking = await this.prisma.ranking.findUnique({
      where: { editionId_userId: { editionId, userId } },
      include: { user: true },
    });

    return userRanking ? userRanking.position : null;
  }

  async getCurrentEditionRanking(req: Express.Request): Promise<RankingResponse> {
    const currEdition = await this.editionsService.getCurrentEdition().catch(() => null);
    if (!currEdition) return [];

    const block = currEdition.rankingEndDate && currEdition.rankingEndDate <= new Date();
    if (req.user.role === 'member' && block) {
      throw new ForbiddenException('Não é mais possível acessar o ranking desta edição');
    }

    const rankings = await this.prisma.ranking.findMany({
      where: { editionId: currEdition.id },
      include: { user: true },
    });

    const sortedRankings = this.sortRankings(rankings);
    return this.formatRankings(sortedRankings);
  }

  async getAnnualRanking(): Promise<RankingResponse> {
    const currEdition = await this.editionsService.getCurrentEdition().catch(() => null);
    const currentYear = new Date().getFullYear();
    const editionsInYear = await this.prisma.edition.findMany({
      where: {
        startDate: { gte: new Date(currentYear, 0, 1) },
        endDate: { lte: new Date(currentYear, 11, 31, 23, 59, 59) },
        id: { not: currEdition?.id },
      },
      orderBy: { startDate: 'desc' },
    });

    const editionIds = editionsInYear.map((e) => e.id);
    const rankings = await this.prisma.ranking.findMany({
      where: { editionId: { in: editionIds } },
      include: { user: true },
    });

    const aggregatedRankings = await this.aggregateRankings(rankings);
    const sortedRankings = this.sortRankings(aggregatedRankings);
    return this.formatRankings(sortedRankings);
  }

  async getGeneralRanking(): Promise<RankingResponse> {
    const currEdition = await this.editionsService.getCurrentEdition().catch(() => null);
    const rankings = await this.prisma.ranking.findMany({
      where: { editionId: { not: currEdition?.id } },
      include: { user: true },
    });

    const aggregatedRankings = await this.aggregateRankings(rankings);
    const sortedRankings = this.sortRankings(aggregatedRankings);
    return this.formatRankings(sortedRankings);
  }

  async aggregateRankings(rankings: RankingWithUser[]): Promise<RankingWithUser[]> {
    const userMap: Map<string, RankingWithUser> = new Map();

    for (const ranking of rankings) {
      const existing = userMap.get(ranking.userId);
      if (!existing) {
        userMap.set(ranking.userId, { ...ranking });
        continue;
      }

      existing.xpCount += ranking.xpCount;
    }

    return Array.from(userMap.values());
  }

  sortRankings(rankings: RankingWithUser[]) {
    return rankings.sort((a, b) => {
      if (b.xpCount !== a.xpCount) return b.xpCount - a.xpCount;

      const aWins =
        a.user.firstPlaceCount + a.user.secondPlaceCount + a.user.thirdPlaceCount;
      const bWins =
        b.user.firstPlaceCount + b.user.secondPlaceCount + b.user.thirdPlaceCount;

      if (bWins !== aWins) return bWins - aWins;
      return a.user.name.localeCompare(b.user.name);
    });
  }

  formatRankings(rankings: RankingWithUser[]) {
    return rankings.map((r, index) => ({
      id: r.user.id,
      name: r.user.name,
      role: r.user.role,
      xp: r.xpCount,
      wins: r.user.firstPlaceCount + r.user.secondPlaceCount + r.user.thirdPlaceCount,
      position: index + 1,
    }));
  }
}
