import { JwtPayloadDto } from '@modules/auth/dtos/auth.dto';

declare module 'socket.io' {
  interface Socket {
    user?: JwtPayloadDto;
    timeoutId?: NodeJS.Timeout;
  }
}
