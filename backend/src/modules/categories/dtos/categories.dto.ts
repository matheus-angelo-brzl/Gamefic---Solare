import type { Category } from '@generated/prisma/client';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE } from '@common/validation/regex';

const CreateCategorySchema = z.object({
  name: z
    .string('É preciso enviar um nome válido')
    .min(5, 'O nome deve ter pelo menos 5 caracteres')
    .max(20, 'O nome não pode ter mais de 20 caracteres')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
}) satisfies z.ZodType<Omit<Category, 'id'>>;

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
