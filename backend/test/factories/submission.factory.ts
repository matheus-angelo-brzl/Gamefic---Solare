import type { Submission } from '@generated/prisma/client';
import { faker } from '@faker-js/faker';

export const createSubmissionMock = (overrides?: Partial<Submission>): Submission => ({
  id: faker.string.uuid(),
  description: faker.lorem.paragraph(),
  attachmentKey: `submissions/${faker.system.fileName()}`,
  fileName: faker.system.fileName(),
  status: 'pending',
  createdAt: new Date(),
  taskId: faker.string.uuid(),
  userId: faker.string.uuid(),
  validatorId: null,
  ...overrides,
});
