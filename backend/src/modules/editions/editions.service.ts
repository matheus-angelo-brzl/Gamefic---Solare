import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEditionDto, UpdateEditionDto } from './dtos/editions.dto';
import { PrismaService } from '@common/prisma/prisma.service';

// Gerencia os períodos de competição (Edições).
// Garante que as datas sejam válidas e que não existam edições simultâneas.

@Injectable()
export class EditionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEditions() {
    return await this.prisma.edition.findMany({ orderBy: { startDate: 'desc' } });
  }

  async getCurrentEdition() {
    const currentEdition = await this.prisma.edition.findFirst({
      where: {
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
        isActive: true,
      },
    });

    if (!currentEdition) {
      throw new NotFoundException('Não há uma edição ativa no momento');
    }

    return currentEdition;
  }

  async getEditionById(id: string) {
    const existingEdition = await this.prisma.edition.findUnique({ where: { id } });
    if (!existingEdition) {
      throw new NotFoundException('Edição não encontrada');
    }

    return existingEdition;
  }

  async createEdition(dto: CreateEditionDto) {
    const { startDate, endDate, rankingEndDate } = dto;

    this.validateDates(startDate, endDate, rankingEndDate);
    await this.validateOverlapping(startDate, endDate);

    return await this.prisma.edition.create({ data: dto });
  }

  async updateEdition(id: string, dto: UpdateEditionDto) {
    const existingEdition = await this.getEditionById(id);
    const { startDate, endDate, rankingEndDate } = { ...existingEdition, ...dto };

    this.validateDates(startDate, endDate, rankingEndDate);

    const started = existingEdition.startDate < new Date();
    const changedStartDate = startDate.getTime() != existingEdition.startDate.getTime();
    const changedEndDate = endDate.getTime() != existingEdition.endDate.getTime();
    const invalidEndDate = changedEndDate && endDate < new Date();

    if (started && (changedStartDate || invalidEndDate)) {
      throw new BadRequestException('Operação impossível para edições já iniciadas');
    }

    await this.validateOverlapping(startDate, endDate, id);

    return await this.prisma.edition.update({ where: { id }, data: dto });
  }

  private validateDates(startDate: Date, endDate: Date, rankingEndDate?: Date | null) {
    if (startDate >= endDate) {
      throw new BadRequestException('A data final deve ser posterior à data de início');
    }

    if (rankingEndDate && (rankingEndDate > endDate || rankingEndDate < startDate)) {
      throw new BadRequestException('Data de ocultação do ranking inválida');
    }
  }

  // Impede a criação de uma edição que ocorra na mesma data de uma já existente.
  async validateOverlapping(startDate: Date, endDate: Date, excludeId?: string) {
    const conflict = await this.prisma.edition.findFirst({
      where: {
        startDate: { lt: endDate },
        endDate: { gt: startDate },
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    if (conflict) {
      throw new BadRequestException('Já existe uma edição ativa nesse período');
    }
  }
}
