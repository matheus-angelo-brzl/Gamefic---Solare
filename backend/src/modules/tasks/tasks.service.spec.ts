import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { createEditionMock } from '@test/factories/edition.factory';
import { createTaskMock, createTaskDto } from '@test/factories/task.factory';
import { createCategoryMock } from '@test/factories/category.factory';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { EditionsService } from '@modules/editions/editions.service';
import { CategoriesService } from '@modules/categories/categories.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let editionsService: DeepMockProxy<EditionsService>;
  let categoriesService: DeepMockProxy<CategoriesService>;
  let service: TasksService;

  const mockCategory = createCategoryMock();
  const mockEdition = createEditionMock();
  const mockTask = createTaskMock({ editionId: mockEdition.id });

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    editionsService = mockDeep<EditionsService>();
    categoriesService = mockDeep<CategoriesService>();

    editionsService.getCurrentEdition.mockResolvedValue(mockEdition);
    categoriesService.upsertCategory.mockResolvedValue(mockCategory);
    prisma.task.findUnique.mockResolvedValue(mockTask);
    prisma.task.findMany.mockResolvedValue([mockTask]);
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    prisma.task.create.mockResolvedValue({ ...mockTask, ...createTaskDto });
    prisma.task.update.mockResolvedValue({ ...mockTask, name: 'New Name' });

    service = new TasksService(prisma, editionsService, categoriesService);
  });

  describe('getActiveTasks', () => {
    it('should return tasks from current edition', async () => {
      const result = await service.getActiveTasks();

      expect(result).toEqual([mockTask]);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          editionId: mockEdition.id,
          OR: [{ remainingConclusions: { gt: 0 } }, { remainingConclusions: null }],
        },
        include: { category: true },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('createTask', () => {
    it('should link new task to current edition', async () => {
      const result = await service.createTask(createTaskDto, 'id');

      expect(result.editionId).toBe(mockEdition.id);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          categoryId: mockCategory.id,
          editionId: mockEdition.id,
          creatorId: 'id',
        },
      });
    });

    it('should throw BadRequestException if task already exists (P2002)', async () => {
      prisma.task.create.mockRejectedValue({ code: 'P2002' });
      const result = service.createTask(createTaskDto, 'id');

      await expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateTask', () => {
    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);
      const result = service.updateTask('invalid-id', { name: 'New Name' });

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should update task if it exists', async () => {
      const updateDto = { name: 'New Name', categoryName: 'New Cat' };
      const result = await service.updateTask(mockTask.id, updateDto);

      expect(result.name).toBe('New Name');
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { name: 'New Name', categoryId: mockCategory.id },
      });
    });
  });

  describe('deleteTask', () => {
    it('should perform soft delete', async () => {
      prisma.task.update.mockResolvedValue({ ...mockTask, isActive: false });
      const result = await service.deleteTask(mockTask.id);

      expect(result.isActive).toBe(false);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);
      const result = service.deleteTask('invalid-id');

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
