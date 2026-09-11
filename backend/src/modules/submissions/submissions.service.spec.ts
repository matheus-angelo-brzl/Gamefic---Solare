import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { createEditionMock } from '@test/factories/edition.factory';
import { createTaskMock } from '@test/factories/task.factory';
import { createSubmissionMock } from '@test/factories/submission.factory';
import { createUserMock } from '@test/factories/user.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { StorageService } from '@common/storage/storage.service';
import { EditionsService } from '@modules/editions/editions.service';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dtos/submissions.dto';

describe('SubmissionsService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let storageService: DeepMockProxy<StorageService>;
  let editionsService: DeepMockProxy<EditionsService>;
  let service: SubmissionsService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    storageService = mockDeep<StorageService>();
    editionsService = mockDeep<EditionsService>();

    editionsService.getCurrentEdition.mockResolvedValue(mockEdition);
    prisma.submission.findMany.mockResolvedValue([mockSubmission]);

    service = new SubmissionsService(prisma, storageService, editionsService);
  });

  const mockUser = createUserMock();
  const mockEdition = createEditionMock();
  const mockTask = createTaskMock({
    editionId: mockEdition.id,
    maxConclusions: 5,
    remainingConclusions: 5,
  });
  const mockSubmission = createSubmissionMock({ taskId: mockTask.id });

  describe('getUserSubmissions', () => {
    it('should return submissions for a user ordered by creation date', async () => {
      const result = await service.getUserSubmissions(mockSubmission.userId);

      expect(result).toEqual([mockSubmission]);
      expect(prisma.submission.findMany).toHaveBeenCalledWith({
        where: { userId: mockSubmission.userId, task: { editionId: mockEdition.id } },
        include: { task: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    });
  });

  describe('getPendingSubmissions', () => {
    it('should return pending submissions ordered by creation date ascending', async () => {
      const result = await service.getPendingSubmissions(mockUser.id);

      expect(result).toEqual([mockSubmission]);
      expect(prisma.submission.findMany).toHaveBeenCalledWith({
        where: {
          status: 'pending',
          task: { editionId: mockEdition.id },
          userId: { not: mockUser.id },
        },
        include: {
          task: { include: { category: true } },
          user: { select: { name: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('getAttachment', () => {
    it('should return a signed url for the attachment', async () => {
      storageService.getSignedUrl.mockResolvedValue('http://signed.url');
      const result = await service.getAttachment('key-123');

      expect(result).toBe('http://signed.url');
      expect(storageService.getSignedUrl).toHaveBeenCalledWith('key-123');
    });
  });

  describe('createSubmission', () => {
    const dto: CreateSubmissionDto = {
      taskId: mockTask.id,
      description: 'My valid submission',
    };

    const mockFile = {
      originalname: 'file.pdf',
      buffer: Buffer.from('test'),
      mimetype: 'application/pdf',
      size: 1000,
      fieldname: 'file',
      encoding: '7bit',
    } as Express.Multer.File;

    it('should throw NotFoundException if task does not exist or is inactive', async () => {
      editionsService.getCurrentEdition.mockResolvedValue(mockEdition);
      prisma.task.findUnique.mockResolvedValue(null);
      const result = service.createSubmission('user-2', dto, mockFile);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if task edition does not match current edition', async () => {
      editionsService.getCurrentEdition.mockResolvedValue(mockEdition);
      prisma.task.findUnique.mockResolvedValue({ ...mockTask, editionId: 'ed-other' });

      await expect(service.createSubmission('user-2', dto, mockFile)).rejects.toThrow(
        new NotFoundException('Tarefa não existe ou não pode ser concluída'),
      );
    });

    it('should throw BadRequestException if file is missing or empty', async () => {
      editionsService.getCurrentEdition.mockResolvedValue(mockEdition);
      prisma.task.findUnique.mockResolvedValue(mockTask);

      const emptyFile = { ...mockFile, buffer: Buffer.from('') };

      await expect(
        service.createSubmission(
          'user-2',
          dto,
          undefined as unknown as Express.Multer.File,
        ),
      ).rejects.toThrow(
        new BadRequestException('É preciso enviar um arquivo de comprovação'),
      );

      await expect(service.createSubmission('user-2', dto, emptyFile)).rejects.toThrow(
        new BadRequestException('É preciso enviar um arquivo de comprovação'),
      );
    });

    it('should save file and create submission', async () => {
      editionsService.getCurrentEdition.mockResolvedValue(mockEdition);
      prisma.task.findUnique.mockResolvedValue(mockTask);
      storageService.saveFile.mockResolvedValue({
        key: mockSubmission.attachmentKey,
        url: 'http://url',
      });
      prisma.submission.create.mockResolvedValue(mockSubmission);

      const result = await service.createSubmission(mockSubmission.userId, dto, mockFile);

      expect(result).toEqual(mockSubmission);
      expect(storageService.saveFile).toHaveBeenCalledWith(mockFile, 'submissions');
      expect(prisma.submission.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId: mockSubmission.userId,
          attachmentKey: mockSubmission.attachmentKey,
          fileName: 'file.pdf',
        },
      });
    });
  });
});
