import type { Socket } from 'socket.io';
import { BaseGateway } from '@common/socket/base.gateway';
import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'ranking', cors: { origin: '*' } })
export class CompetitionGateway extends BaseGateway {
  handleConnection(client: Socket): void {
    super.handleConnection(client);
    if (client.user) {
      client.join('ranking_room');
    }
  }

  broadcastRankingUpdate() {
    this.server.to('ranking_room').emit('rankingUpdate');
  }
}
