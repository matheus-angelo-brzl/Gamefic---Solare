import { Controller, Get } from '@nestjs/common';
import { Access } from '@common/access/access.decorator';
import { HealthService } from './health.service';

@Access('public')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  async getHealth() {
    return {
      api: this.healthService.getApiHealth(),
      database: await this.healthService.getDatabaseHealth(),
    };
  }
}
