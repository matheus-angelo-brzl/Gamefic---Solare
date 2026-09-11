import type { Task } from '@generated/prisma/client';
import type { CreateTaskDto } from '@modules/tasks/dtos/tasks.dto';
import { faker } from '@faker-js/faker';

export const createTaskMock = (overrides?: Partial<Task>): Task => ({
  id: faker.string.uuid(),
  name: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  xp: faker.number.int({ min: 10, max: 1000 }),
  maxConclusions: null,
  remainingConclusions: null,
  repeatNextEdition: true,
  isActive: true,
  editionId: faker.string.uuid(),
  categoryId: faker.string.uuid(),
  creatorId: faker.string.uuid(),
  createdAt: faker.date.recent(),
  ...overrides,
});

export const createTaskDto: CreateTaskDto = {
  name: 'New Task',
  description: 'Desc',
  xp: 100,
  categoryName: 'cat-1',
  maxConclusions: null,
  repeatNextEdition: true,
};
