import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { EditionsModule } from '@modules/editions/editions.module';
import { RankingModule } from '@modules/ranking/ranking.module';

@Module({
  imports: [EditionsModule, RankingModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
