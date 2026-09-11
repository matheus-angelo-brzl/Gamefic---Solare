import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ZodValidationException } from 'nestjs-zod';

// Captura erros de validação de DTOs Zod e os emite no canal 'exception' do WebSocket

@Catch(ZodValidationException)
export class WsValidationFilter extends BaseWsExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const errorResponse = exception.getResponse();
    const wsException = new WsException(errorResponse);
    super.catch(wsException, host);
  }
}
