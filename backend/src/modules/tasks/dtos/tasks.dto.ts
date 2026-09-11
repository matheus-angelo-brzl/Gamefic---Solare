import type { Task } from '@generated/prisma/client';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE } from '@common/validation/regex';

const TaskBaseSchema = z.object({
  name: z
    .string('É preciso enviar um nome válido')
    .min(6, 'O nome deve ter pelo menos 6 caracteres')
    .max(32, 'O nome não pode ter mais de 32 caracteres')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
  description: z
    .string('É preciso enviar uma descrição válida')
    .min(20, 'A descrição deve ter pelo menos 20 caracteres')
    .max(200, 'A descrição não pode ter mais de 200 caracteres')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
  categoryName: z
    .string('É preciso enviar um nome de categoria válido')
    .min(3, 'O nome da categoria deve ter pelo menos 3 caracteres')
    .max(20, 'O nome da categoria não pode ter mais de 20 caracteres')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
  xp: z
    .int('É preciso enviar um valor de XP válido')
    .max(1000, 'O XP não pode ser maior que 1000')
    .positive('O XP deve ser um número positivo'),
  maxConclusions: z
    .int('É preciso enviar um valor de conclusões máximas válido')
    .positive('O número de conclusões máximas deve ser um número positivo')
    .nullable(),
  remainingConclusions: z
    .int('É preciso enviar um valor de conclusões restantes válido')
    .positive('O número de conclusões restantes deve ser um número positivo')
    .nullable()
    .optional(),
  repeatNextEdition: z
    .boolean('É preciso enviar um valor para repetir na próxima edição')
    .optional(),
});

export const CreateTaskDtoSchema = TaskBaseSchema.extend({
  repeatNextEdition: z.boolean().default(true),
}) satisfies z.ZodType<
  Omit<
    Task,
    | 'id'
    | 'editionId'
    | 'categoryId'
    | 'isActive'
    | 'creatorId'
    | 'createdAt'
    | 'remainingConclusions'
  >
>;

export class CreateTaskDto extends createZodDto(CreateTaskDtoSchema) {}

const UpdateTaskDtoSchema = TaskBaseSchema.partial();

export class UpdateTaskDto extends createZodDto(UpdateTaskDtoSchema) {}
