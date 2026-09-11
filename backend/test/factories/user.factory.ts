import type { User } from '@generated/prisma/client';
import { Role } from '@generated/prisma/enums';
import { faker } from '@faker-js/faker';

export const createUserMock = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  role: Role.member,
  recordXp: faker.number.int({ min: 0, max: 1000 }),
  recordMissions: faker.number.int({ min: 0, max: 100 }),
  recordPosition: faker.number.int({ min: 1, max: 100 }),
  firstPlaceCount: faker.number.int({ min: 0, max: 50 }),
  secondPlaceCount: faker.number.int({ min: 0, max: 50 }),
  thirdPlaceCount: faker.number.int({ min: 0, max: 50 }),
  ...overrides,
});
