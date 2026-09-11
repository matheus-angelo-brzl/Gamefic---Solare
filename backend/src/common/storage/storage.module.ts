import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { StorageConfig } from './storage.config';
import { LargeFileExceptionFilter } from './large-file-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [
    StorageConfig,
    StorageService,
    {
      provide: APP_FILTER,
      useClass: LargeFileExceptionFilter,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
