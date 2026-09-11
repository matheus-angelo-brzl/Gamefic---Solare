import type { Prisma } from '@generated/prisma/client';
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/categories.dto';
import { PrismaService, PrismaError } from '@common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories() {
    return this.prismaService.category.findMany();
  }

  async createCategory(dto: CreateCategoryDto) {
    return this.prismaService.category.create({ data: dto }).catch((err: PrismaError) => {
      if (err.code === 'P2002') {
        throw new ConflictException('Já existe uma categoria com esse nome');
      }
      throw err;
    });
  }

  async upsertCategory(name: string, prismaClient: Prisma.TransactionClient) {
    return prismaClient.category
      .upsert({ where: { name }, create: { name }, update: {} })
      .catch((err: PrismaError) => {
        if (err.code === 'P2002') {
          throw new ConflictException('Já existe uma categoria com esse nome');
        }
        throw err;
      });
  }
}
