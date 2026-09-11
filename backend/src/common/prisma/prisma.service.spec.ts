import { createConfigServiceMock } from '@test/factories/config.factory';
import { PrismaConfig } from './prisma.config';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  const mockConfigService = createConfigServiceMock();

  beforeEach(() => {
    const prismaConfig = new PrismaConfig(mockConfigService);
    prismaService = new PrismaService(prismaConfig);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });
});
