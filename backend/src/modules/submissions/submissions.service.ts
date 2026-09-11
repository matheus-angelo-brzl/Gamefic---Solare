import { CreateSubmissionDto } from './dtos/submissions.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { StorageService } from '@common/storage/storage.service';
import { EditionsService } from '@modules/editions/editions.service';

type File = Express.Multer.File;

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly editionsService: EditionsService,
  ) {}

  async getUserSubmissions(userId: string) {
    const currEdition = await this.editionsService.getCurrentEdition().catch(() => null);
    if (!currEdition) return [];

    return this.prismaService.submission.findMany({
      where: { userId, task: { editionId: currEdition.id } },
      include: { task: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getPendingSubmissions(userId: string) {
    const currEdition = await this.editionsService.getCurrentEdition().catch(() => null);
    if (!currEdition) return [];

    return this.prismaService.submission.findMany({
      where: {
        status: 'pending',
        task: { editionId: currEdition.id },
        userId: { not: userId },
      },
      include: {
        task: { include: { category: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAttachment(key: string) {
    return this.storageService.getSignedUrl(key);
  }

  async createSubmission(userId: string, dto: CreateSubmissionDto, file: File) {
    await this.validateTask(dto.taskId);

    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('É preciso enviar um arquivo de comprovação');
    }

    const alreadyExists = await this.prismaService.submission.findFirst({
      where: { userId, taskId: dto.taskId, status: 'pending' },
    });

    if (alreadyExists) {
      throw new BadRequestException('Já existe uma submissão pendente para essa tarefa');
    }

    const { key } = await this.storageService.saveFile(file, 'submissions');

    return await this.prismaService.submission.create({
      data: { ...dto, userId, attachmentKey: key, fileName: file.originalname },
    });
  }

  private async validateTask(taskId: string) {
    const currentEdition = await this.editionsService.getCurrentEdition();

    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
        OR: [{ remainingConclusions: { gt: 0 } }, { remainingConclusions: null }],
      },
    });

    if (!task || task.isActive === false || task.editionId !== currentEdition.id) {
      throw new NotFoundException('Tarefa não existe ou não pode ser concluída');
    }
  }
}
