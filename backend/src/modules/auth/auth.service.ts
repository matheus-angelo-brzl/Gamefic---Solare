import { RegisterDto, LoginDto } from './dtos/auth.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { JwtService } from '@common/jwt/jwt.service';
import bcrypt from 'bcrypt';

// Gerencia a autenticação e criação de contas.
// Responsável por validar credenciais e gerar o JWT de acesso.

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly hashSaltRounds = 10;

  async registerUser(dto: RegisterDto) {
    dto.password = await bcrypt.hash(dto.password, this.hashSaltRounds);
    const user = await this.prismaService.user.create({ data: dto });

    return this.jwtService.sign(user);
  }

  async loginUser(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new Error();

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new Error();

    return this.jwtService.sign(user);
  }
}
