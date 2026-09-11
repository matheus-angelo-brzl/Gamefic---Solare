import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaConfig {
  public readonly url: string;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('DB_USER');
    const password = this.configService.get<string>('DB_PASSWORD');
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<string>('DB_PORT');
    const dbName = this.configService.get<string>('DB_NAME');

    if (!user || !password || !host || !port || !dbName) {
      throw new Error('Variáveis de ambiente do banco de dados não encontradas');
    }

    this.url = `postgresql://${user}:${password}@${host}:${port}/${dbName}?schema=public`;
  }
}
