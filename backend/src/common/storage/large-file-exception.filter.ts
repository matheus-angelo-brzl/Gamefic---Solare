import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PayloadTooLargeException } from '@nestjs/common';
import type { Response } from 'express';

@Catch(PayloadTooLargeException)
export class LargeFileExceptionFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const statusCode = exception.getStatus();

    return response.status(statusCode).json({
      message: 'Arquivo muito grande',
      error: 'Payload Too Large',
      statusCode,
    });
  }
}
