import { Controller, Get, Req, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getSelfMetrics(@Req() req: Express.Request) {
    return await this.metricsService.getUserMetricsById(req.user.id);
  }

  @Get('/editions/:id')
  async getEditionMetrics(@Param('id') id: string) {
    return await this.metricsService.getEditionMetricsById(id);
  }
}
