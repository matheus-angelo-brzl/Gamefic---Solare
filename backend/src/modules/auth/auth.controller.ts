import type { PrismaError } from '@common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dtos/auth.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Access } from '@common/access/access.decorator';
import { AuthService } from './auth.service';

@Access('public')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto).catch((err: PrismaError) => {
      if (err.code === 'P2002') {
        throw new ConflictException('Email já registrado');
      }
    });
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto).catch(() => {
      throw new UnauthorizedException('Email ou senha inválidos');
    });
  }
}
