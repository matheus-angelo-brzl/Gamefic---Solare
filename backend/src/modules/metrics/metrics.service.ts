import type { Ranking, User } from '@generated/prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { EditionsService } from '@modules/editions/editions.service';
import { RankingService } from '@modules/ranking/ranking.service';

type RankingMetrics = Omit<Ranking, 'id' | 'userId' | 'editionId'>;
type UserMetrics = Omit<User, 'id' | 'password'> & RankingMetrics;

@Injectable()
export class MetricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly editionsService: EditionsService,
    private readonly rankingService: RankingService,
  ) {}

  async getUserMetricsById(id: string): Promise<UserMetrics> {
    const userData = await this.prisma.user.findUnique({ where: { id } });
    if (!userData) throw new NotFoundException('Usuário não encontrado');

    const currEdition = await this.editionsService.getCurrentEdition().catch(() => null);
    if (!currEdition) {
      return { ...userData, xpCount: 0, missionsCount: 0, position: 0 };
    }

    const currRanking = await this.prisma.ranking.findUnique({
      where: {
        editionId_userId: {
          editionId: currEdition.id,
          userId: id,
        },
      },
    });

    const xpCount = currRanking?.xpCount || 0;
    const missionsCount = currRanking?.missionsCount || 0;
    const position = await this.rankingService.getUserPosition(id, currEdition.id);

    return { ...userData, xpCount, missionsCount, position: position ?? 0 };
  }

  async getEditionMetricsById(id: string) {
    const edition = await this.editionsService.getEditionById(id);

    const [missionsCompleted, submissionsGrouped, rankingTotalXp] = await Promise.all([
      this.prisma.task.count({
        where: { editionId: id, remainingConclusions: 0, isActive: true },
      }),
      this.prisma.submission.groupBy({
        by: ['status'],
        where: { task: { editionId: id } },
        _count: { status: true },
      }),
      this.prisma.ranking.aggregate({
        where: { editionId: id },
        _sum: { xpCount: true },
      }),
    ]);

    const submissions = submissionsGrouped.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.status;
        acc.received += curr._count.status;
        return acc;
      },
      { received: 0, pending: 0, approved: 0, rejected: 0 },
    );

    const totalXpDistributed = rankingTotalXp._sum.xpCount || 0;

    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const now = normalizeDate(new Date());
    const start = normalizeDate(new Date(edition.startDate));
    const end = normalizeDate(new Date(edition.endDate));
    const msPerDay = 1000 * 60 * 60 * 24;

    let remainingDays = Math.ceil((end.getTime() - now.getTime()) / msPerDay);

    if (now < start) {
      remainingDays = Math.round((start.getTime() - now.getTime()) / msPerDay);
    } else if (now > end) {
      remainingDays = Math.round((now.getTime() - end.getTime()) / msPerDay);
    }

    return { missionsCompleted, totalXpDistributed, submissions, remainingDays };
  }
}
