import type { Prisma, Submission, User, Task, Ranking } from '@generated/prisma/client';
import { EvaluateSubmissionDto } from './dtos/competition.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RankingService } from '@modules/ranking/ranking.service';
import { CompetitionGateway } from './competition.gateway';

type Sub = Submission & { user: User; task: Task };

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rankingService: RankingService,
    private readonly competitionGateway: CompetitionGateway,
  ) {}

  broadCast() {
    this.competitionGateway.broadcastRankingUpdate();
  }

  // A cada hora procura por alguma edição recém-expirada e a finaliza
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredEditions() {
    const now = new Date();
    const edition = await this.prisma.edition.findFirst({
      where: { isActive: true, endDate: { lte: now } },
    });

    if (edition) {
      await this.closeEdition(edition.id);
    }
  }

  async evaluateSubmission(dto: EvaluateSubmissionDto, validatorId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const submission = await tx.submission.findUnique({
        where: { id: dto.id },
        include: { user: true, task: true },
      });

      if (!submission || submission.status !== 'pending') {
        throw new NotFoundException('Submissão não encontrada ou já avaliada');
      }

      const updatedSubmission = await tx.submission.update({
        where: { id: dto.id },
        data: { status: dto.status, validatorId: validatorId },
      });

      if (dto.status === 'approved') {
        await this.handleTaskConclusion(submission, tx);
        await this.handleUserConclusion(submission, tx);
        await this.handleRankingConclusion(submission, tx);
      }

      return updatedSubmission;
    });

    if (dto.status === 'approved') {
      this.competitionGateway.broadcastRankingUpdate();
    }

    return result;
  }

  private async handleTaskConclusion(sub: Sub, tx: Prisma.TransactionClient) {
    if (sub.task.remainingConclusions === null) return;

    const updatedTasks = await tx.task.updateMany({
      where: { id: sub.taskId, remainingConclusions: { gt: 0 } },
      data: { remainingConclusions: { decrement: 1 } },
    });

    if (updatedTasks.count === 0) {
      throw new NotFoundException('Esta tarefa não pode mais ser concluída');
    }
  }

  private async handleUserConclusion(sub: Sub, tx: Prisma.TransactionClient) {
    const currentRanking = await tx.ranking.upsert({
      where: { editionId_userId: { editionId: sub.task.editionId, userId: sub.userId } },
      create: {
        editionId: sub.task.editionId,
        userId: sub.userId,
        xpCount: sub.task.xp,
        missionsCount: 1,
        position: 0, // Zerado, corrigido em handleRankingConclusion
      },
      update: {
        xpCount: { increment: sub.task.xp },
        missionsCount: { increment: 1 },
      },
    });

    // Atualiza recordes pessoais do usuário
    await tx.user.update({
      where: { id: sub.userId },
      data: {
        recordXp: Math.max(currentRanking.xpCount, sub.user.recordXp),
        recordMissions: Math.max(currentRanking.missionsCount, sub.user.recordMissions),
      },
    });
  }

  async handleRankingConclusion(sub: Sub, tx: Prisma.TransactionClient) {
    const allRankings = await tx.ranking.findMany({
      where: { editionId: sub.task.editionId },
      include: { user: true },
    });

    const sortedRankings = this.rankingService.sortRankings(allRankings);
    const rankingUpdates = sortedRankings.reduce((promises, r, index) => {
      const position = index + 1;
      if (r.position === position) return promises;

      promises.push(tx.ranking.update({ where: { id: r.id }, data: { position } }));
      return promises;
    }, [] as Promise<Ranking>[]);

    await Promise.all(rankingUpdates);
  }

  async closeEdition(editionId: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.edition.update({ where: { id: editionId }, data: { isActive: false } });

      const allRankings = await tx.ranking.findMany({
        where: { editionId: editionId },
        orderBy: { position: 'asc' },
        include: { user: true },
      });

      // Atualiza recordes estáticos (que exigem o fim da edição para contabilizar)
      const promises = allRankings.map((r) => {
        return tx.user.update({
          where: { id: r.userId },
          data: {
            firstPlaceCount: r.position === 1 ? { increment: 1 } : undefined,
            secondPlaceCount: r.position === 2 ? { increment: 1 } : undefined,
            thirdPlaceCount: r.position === 3 ? { increment: 1 } : undefined,
            recordPosition:
              r.position > 0
                ? Math.min(r.position, r.user.recordPosition || Infinity)
                : r.user.recordPosition,
          },
        });
      });

      await Promise.all(promises);
    });
  }

  async testAddXp(userId: string, editionId: string, xpAmount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const fakeSub = { userId, task: { editionId, xp: xpAmount }, user } as Sub;

    await this.prisma.$transaction(async (tx) => {
      await this.handleUserConclusion(fakeSub, tx);
      await this.handleRankingConclusion(fakeSub, tx);
    });

    return this.competitionGateway.broadcastRankingUpdate();
  }
}
