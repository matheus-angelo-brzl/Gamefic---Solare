import type { CreateCategoryDto } from './dtos/categories.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { createCategoryMock } from '@test/factories/category.factory';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: CategoriesService;

  const mockCategory = createCategoryMock();

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new CategoriesService(prisma);
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      prisma.category.findMany.mockResolvedValue([mockCategory]);
      const result = await service.getAllCategories();

      expect(result).toEqual([mockCategory]);
      expect(prisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const dto: CreateCategoryDto = { name: 'New Category' };

      prisma.category.create.mockResolvedValue({ ...mockCategory, ...dto });
      const result = await service.createCategory(dto);

      expect(result.name).toBe(dto.name);
      expect(prisma.category.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if category name already exists (P2002)', async () => {
      const dto: CreateCategoryDto = { name: 'Existing Category' };

      prisma.category.create.mockRejectedValue({ code: 'P2002' });
      const result = service.createCategory(dto);

      await expect(result).rejects.toThrow(ConflictException);
      expect(prisma.category.create).toHaveBeenCalled();
    });
  });
});
