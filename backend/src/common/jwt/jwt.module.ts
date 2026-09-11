import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { JwtConfig } from './jwt.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [JwtService, JwtConfig],
  exports: [JwtService],
})
export class JwtModule {}
