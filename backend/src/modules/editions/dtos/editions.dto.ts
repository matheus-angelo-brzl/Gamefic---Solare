import type { Edition } from '@generated/prisma/client';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE } from '@common/validation/regex';

export const CreateEditionDtoSchema = z.object({
  name: z
    .string('É preciso enviar um nome válido')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(32, 'O nome não pode ter mais de 32 caracteres')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
  startDate: z.coerce.date('É preciso enviar uma data de início válida'),
  endDate: z.coerce.date('É preciso enviar uma data de término válida'),
  rankingEndDate: z.coerce
    .date('É preciso enviar uma data final de ranking válida')
    .nullable(),
}) satisfies z.ZodType<Omit<Edition, 'id' | 'isActive'>>;

export class CreateEditionDto extends createZodDto(CreateEditionDtoSchema) {}

export const UpdateEditionDtoSchema = CreateEditionDtoSchema.partial();

export class UpdateEditionDto extends createZodDto(UpdateEditionDtoSchema) {}
