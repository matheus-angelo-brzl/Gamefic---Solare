import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE } from '@common/validation/regex';

export const CreateSubmissionDtoSchema = z.object({
  taskId: z.uuid(),
  description: z
    .string('É preciso enviar uma descrição válida')
    .min(16, 'A descrição é muito curta')
    .max(512, 'A descrição é muito longa')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
});

export class CreateSubmissionDto extends createZodDto(CreateSubmissionDtoSchema) {}
