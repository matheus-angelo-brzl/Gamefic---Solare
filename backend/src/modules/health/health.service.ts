import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prismaService: PrismaService) {}

  getApiHealth() {
    return { status: 'ok', message: 'API is running' };
  }

  async getDatabaseHealth() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Database connection is healthy' };
    } catch {
      return { status: 'error', message: 'Database connection failed' };
    }
  }
}
