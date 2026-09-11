import type { Category } from '@generated/prisma/client';
import { faker } from '@faker-js/faker';

export const createCategoryMock = (overrides?: Partial<Category>): Category => ({
  id: faker.string.uuid(),
  name: faker.commerce.department(),
  ...overrides,
});
