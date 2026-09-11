import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService, PrismaError } from '@common/prisma/prisma.service';
import { EditionsService } from '@modules/editions/editions.service';
import { CategoriesService } from '@modules/categories/categories.service';

// Gerencia as tarefas e desafios do sistema.
// Garante que as tarefas estejam vinculadas à edição atual.
// Também garante a coerência no número de conclusões restantes.

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly editionsService: EditionsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getActiveTasks() {
    const currentEdition = await this.editionsService.getCurrentEdition();

    return this.prismaService.task.findMany({
      where: {
        OR: [{ remainingConclusions: { gt: 0 } }, { remainingConclusions: null }],
        editionId: currentEdition.id,
        isActive: true,
      },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createTask(dto: CreateTaskDto, creatorId: string) {
    const currentEdition = await this.editionsService.getCurrentEdition();
    dto.remainingConclusions = dto.maxConclusions; // Inicia com o valor máximo

    return this.prismaService.$transaction(async (tx) => {
      const category = await this.categoriesService.upsertCategory(dto.categoryName, tx);
      (dto.categoryName as unknown) = undefined;

      return tx.task
        .create({
          data: {
            ...dto,
            categoryId: category.id,
            editionId: currentEdition.id,
            creatorId,
          },
        })
        .catch((err: PrismaError) => {
          if (err.code === 'P2002') {
            throw new BadRequestException('Tarefa já existe');
          }
          throw err;
        });
    });
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
    const task = await this.prismaService.task.findUnique({ where: { id } });
    delete dto.remainingConclusions; // Impede atualização direta

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (dto.maxConclusions === null) {
      dto.remainingConclusions = null; // Permite tarefas ilimitadas
    } else if (dto.maxConclusions !== undefined) {
      const newConclusions = dto.maxConclusions - (task.maxConclusions || 0);
      dto.remainingConclusions = (task.remainingConclusions || 0) + newConclusions;
    }

    return this.prismaService.$transaction(async (tx) => {
      const categoryId = dto.categoryName
        ? (await this.categoriesService.upsertCategory(dto.categoryName, tx)).id
        : undefined;
      delete dto.categoryName;

      return tx.task
        .update({ where: { id }, data: { ...dto, categoryId } })
        .catch((err: PrismaError) => {
          if (err.code === 'P2002') {
            throw new BadRequestException('Já existe uma tarefa com esse nome');
          }
          throw err;
        });
    });
  }

  // Desativa uma tarefa em vez de excluí-la
  async deleteTask(id: string) {
    const task = await this.prismaService.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return this.prismaService.task.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
