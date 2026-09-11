import type { Server, Socket } from 'socket.io';
import { UseFilters, UsePipes, UseGuards, Inject } from '@nestjs/common';
import { WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { WsValidationFilter } from './ws-validation.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import { WsAccessGuard } from './ws-access.guard';
import { JwtService } from '@common/jwt/jwt.service';

@UsePipes(new ZodValidationPipe())
@UseFilters(new WsValidationFilter())
@UseGuards(WsAccessGuard)
export abstract class BaseGateway implements OnGatewayConnection {
  @WebSocketServer()
  protected server!: Server;

  @Inject()
  protected jwtService!: JwtService;

  handleConnection(client: Socket) {
    const token = this.jwtService.extractTokenFromHandshake(client);
    if (!token) return;

    const payload = this.jwtService.getPayload(token);
    if (payload) {
      client.user = payload;
      this.addClientExpiration(client);
    }
  }

  private addClientExpiration(client: Socket) {
    if (client.timeoutId || !client.user?.exp) return;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remainingTimeInSeconds = client.user.exp - nowInSeconds;

    if (remainingTimeInSeconds <= 0) {
      client.emit('exception', { message: 'Sessão expirada', status: 'error' });
      return client.disconnect();
    }

    client.timeoutId = setTimeout(() => {
      client.emit('exception', { message: 'Sessão expirada', status: 'error' });
      client.disconnect();
    }, remainingTimeInSeconds * 1000);

    client.on('disconnect', () => {
      if (client.timeoutId) clearTimeout(client.timeoutId);
    });
  }
}
