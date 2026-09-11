import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma/client';
import { PrismaConfig } from './prisma.config';
import { PrismaPg } from '@prisma/adapter-pg';

export type { PrismaClientKnownRequestError as PrismaError } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: PrismaConfig) {
    const adapter = new PrismaPg({ connectionString: config.url });
    super({ adapter });
  }
}
