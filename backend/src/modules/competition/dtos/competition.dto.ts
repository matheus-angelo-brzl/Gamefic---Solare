import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const EvaluateSubmissionDtoSchema = z.object({
  id: z.uuid('É preciso enviar um ID de submissão válido'),
  status: z.enum(['approved', 'rejected'], 'É preciso enviar um status válido'),
});

export class EvaluateSubmissionDto extends createZodDto(EvaluateSubmissionDtoSchema) {}

export const BuffUserDtoSchema = z.object({
  userId: z.uuid('É preciso enviar um ID de usuário válido'),
  buff: z.number().min(0, 'É preciso enviar um valor de buff válido'),
});

export class BuffUserDto extends createZodDto(BuffUserDtoSchema) {}
