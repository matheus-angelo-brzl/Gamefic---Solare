import type { Edition } from '@generated/prisma/client';
import { faker } from '@faker-js/faker';

export const createEditionMock = (overrides?: Partial<Edition>): Edition => {
  const startDate = faker.date.soon();
  const endDate = faker.date.future({ refDate: startDate });

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    startDate,
    endDate,
    rankingEndDate: faker.date.between({ from: startDate, to: endDate }),
    isActive: faker.datatype.boolean(),
    ...overrides,
  };
};
