import type { Socket } from 'socket.io';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Reflector } from '@nestjs/core';

@Injectable()
export class WsAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const client = ctx.switchToWs().getClient<Socket>();

    const accessRoles = this.getAccessRoles(ctx);
    if (accessRoles.includes('public')) {
      return true; // Evento público, não requer autenticação
    }

    if (!client.user) {
      throw new WsException('Acesso negado');
    }

    if (accessRoles.length > 0 && !accessRoles.includes(client.user.role)) {
      throw new WsException('Acesso negado');
    }

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
