import type { CreateEditionDto, UpdateEditionDto } from './dtos/editions.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { createEditionMock } from '@test/factories/edition.factory';
import { PrismaService } from '@common/prisma/prisma.service';
import { EditionsService } from './editions.service';

describe('EditionsService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: EditionsService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new EditionsService(prisma);
  });

  const mockEdition = createEditionMock();

  describe('getAllEditions', () => {
    it('should return all editions ordered by startDate desc', async () => {
      prisma.edition.findMany.mockResolvedValue([mockEdition]);
      const result = await service.getAllEditions();

      expect(result).toEqual([mockEdition]);
      expect(prisma.edition.findMany).toHaveBeenCalled();
    });
  });

  describe('getCurrentEdition', () => {
    it('should return the active edition', async () => {
      prisma.edition.findFirst.mockResolvedValue(mockEdition);
      const result = await service.getCurrentEdition();

      expect(result).toEqual(mockEdition);
      expect(prisma.edition.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException when no edition is active', async () => {
      prisma.edition.findFirst.mockResolvedValue(null);
      const result = service.getCurrentEdition();

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEditionById', () => {
    it('should return an edition by id', async () => {
      prisma.edition.findUnique.mockResolvedValue(mockEdition);
      const result = await service.getEditionById(mockEdition.id);

      expect(result).toEqual(mockEdition);
      expect(prisma.edition.findUnique).toHaveBeenCalledWith({
        where: { id: mockEdition.id },
      });
    });

    it('should throw NotFoundException if edition does not exist', async () => {
      prisma.edition.findUnique.mockResolvedValue(null);
      const result = service.getEditionById('invalid');

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('createEdition', () => {
    it('should create an edition with fixed timezone', async () => {
      const dto: CreateEditionDto = {
        name: 'Nova Edição',
        startDate: new Date('2026-06-01T00:00:00Z'),
        endDate: new Date('2026-06-30T00:00:00Z'),
        rankingEndDate: new Date('2026-06-29T00:00:00Z'),
      };

      prisma.edition.findFirst.mockResolvedValue(null);
      prisma.edition.create.mockResolvedValue(mockEdition);
      await service.createEdition(dto);

      expect(prisma.edition.create).toHaveBeenCalledWith({ data: dto });
      expect(dto.startDate.getUTCHours()).toBe(3);
    });

    it('should throw BadRequestException if dates are invalid', async () => {
      const dto: CreateEditionDto = {
        name: 'Erro',
        startDate: new Date('2026-06-30T00:00:00Z'),
        endDate: new Date('2026-06-01T00:00:00Z'),
        rankingEndDate: new Date('2026-06-29T00:00:00Z'),
      };

      const result = service.createEdition(dto);

      await expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateEdition', () => {
    it('should update an edition', async () => {
      const dto: UpdateEditionDto = { name: 'Nome Atualizado' };

      prisma.edition.findUnique.mockResolvedValue(mockEdition);
      prisma.edition.findFirst.mockResolvedValue(null);
      prisma.edition.update.mockResolvedValue(mockEdition);
      const result = await service.updateEdition(mockEdition.id, dto);

      expect(result.name).toBe(mockEdition.name);
      expect(prisma.edition.update).toHaveBeenCalled();
    });
  });

  describe('validateOverlapping', () => {
    it('should throw BadRequestException if there is a conflict', async () => {
      prisma.edition.findFirst.mockResolvedValue(mockEdition);
      const result = service.validateOverlapping(new Date(), new Date());

      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should not throw if there is no conflict', async () => {
      prisma.edition.findFirst.mockResolvedValue(null);
      const result = service.validateOverlapping(new Date(), new Date());

      await expect(result).resolves.not.toThrow();
    });
  });
});
