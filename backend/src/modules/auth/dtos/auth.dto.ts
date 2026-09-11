import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Role } from '@generated/prisma/enums';
import { PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE } from '@common/validation/regex';

const loginSchema = z.object({
  email: z.email('É preciso enviar um email válido'),
  password: z
    .string('É preciso enviar uma senha válida')
    .min(6, 'A senha deve conter no mínimo 6 caracteres')
    .max(20, 'A senha deve conter no máximo 20 caracteres'),
});

export class LoginDto extends createZodDto(loginSchema) {}

const registerSchema = loginSchema.extend({
  name: z
    .string('É preciso enviar um nome válido')
    .min(3, 'O nome deve conter no mínimo 3 caracteres')
    .max(30, 'O nome deve conter no máximo 30 caracteres')
    .regex(PORTUGUESE_TEXT_REGEX, PORTUGUESE_TEXT_MESSAGE),
});

export class RegisterDto extends createZodDto(registerSchema) {}

const jwtPayloadSchema = z.object({
  id: z.uuid('O ID do usuário deve ser um UUID válido'),
  name: z.string('O nome do usuário deve ser uma string'),
  email: z.email('O email do usuário deve ser um email válido'),
  role: z.enum(Role, 'O cargo do usuário deve ser um valor válido'),
  exp: z.number().optional(),
  iat: z.number().optional(),
});

export class JwtPayloadDto extends createZodDto(jwtPayloadSchema) {}
