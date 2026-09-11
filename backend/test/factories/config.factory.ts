import { mock, MockProxy } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';

const createEnvMock = () => ({
  DB_USER: faker.internet.username(),
  DB_PASSWORD: faker.internet.password(),
  DB_HOST: faker.internet.ip(),
  DB_PORT: faker.internet.port(),
  DB_NAME: faker.internet.domainName(),

  AUTH_SECRET: faker.string.alphanumeric(32),

  AWS_REGION: faker.location.country(),
  AWS_ACCESS_KEY_ID: faker.string.alphanumeric(16),
  AWS_SECRET_ACCESS_KEY: faker.string.alphanumeric(32),
  AWS_S3_ENDPOINT: faker.internet.url(),
  AWS_S3_BUCKET_NAME: faker.internet.domainWord(),
});

type EnvConfig = Partial<ReturnType<typeof createEnvMock>>;
type ConfigMock = MockProxy<ConfigService>;

export const createConfigServiceMock = (overrides?: EnvConfig): ConfigMock => {
  const mockEnv = { ...createEnvMock(), ...overrides };
  const configService = mock<ConfigService>();

  configService.get.mockImplementation((key: string) => mockEnv[key]);

  configService.getOrThrow.mockImplementation((key: string) => {
    if (mockEnv[key] === undefined) {
      throw new Error(`Configuration key "${key}" not found`);
    }
    return mockEnv[key];
  });

  return configService;
};
