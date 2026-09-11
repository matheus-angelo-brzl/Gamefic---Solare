import { createConfigServiceMock } from '@test/factories/config.factory';
import { PrismaConfig } from './prisma.config';

describe('PrismaConfig', () => {
  const mockConfigService = createConfigServiceMock({
    DB_USER: 'u',
    DB_PASSWORD: 'p',
    DB_HOST: 'h',
    DB_PORT: 1,
    DB_NAME: 'd',
  });

  it('should mount the url correctly when all variables exist', () => {
    const prismaConfig = new PrismaConfig(mockConfigService);

    expect(prismaConfig.url).toBe('postgresql://u:p@h:1/d?schema=public');
  });

  it('should throw an error if any variable is missing', () => {
    mockConfigService.get.mockReturnValue(undefined);

    expect(() => new PrismaConfig(mockConfigService)).toThrow(
      'Variáveis de ambiente do banco de dados não encontradas',
    );
  });
});
