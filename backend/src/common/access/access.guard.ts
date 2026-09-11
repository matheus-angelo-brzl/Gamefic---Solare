import type { Request } from 'express';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@common/jwt/jwt.service';
import { Reflector } from '@nestjs/core';

// Gerencia as permissões de acesso às rotas do sistema.
// Verifica se o usuário tem permissão para acessar uma rota lendo o seu JWT.

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  // Analisa o JWT e decide se libera ou bloqueia o acesso à rota.
  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest<Request>();

    const accessRoles = this.getAccessRoles(ctx);
    if (accessRoles.includes('public')) {
      return true; // Rota pública, não requer autenticação
    }

    const token = this.jwtService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    const payload = this.jwtService.getPayload(token);
    if (!payload) {
      throw new UnauthorizedException('Token de autenticação inválido');
    }

    // Verifica se o usuário autenticado possui o cargo necessário para acessar a rota.
    if (accessRoles.length > 0 && !accessRoles.includes(payload.role)) {
      throw new ForbiddenException('Acesso negado');
    }

    // Anexa ao objeto Request os dados do usuário autenticado
    request.user = payload;
    return true;
  }

  private getAccessRoles(ctx: ExecutionContext): string[] {
    return (
      this.reflector.getAllAndOverride<string[]>('access', [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || []
    );
  }
}
