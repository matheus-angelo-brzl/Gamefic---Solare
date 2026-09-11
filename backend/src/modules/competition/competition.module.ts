import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { RankingModule } from '@modules/ranking/ranking.module';
import { CompetitionService } from './competition.service';
import { CompetitionGateway } from './competition.gateway';
import { EditionsModule } from '@modules/editions/editions.module';

@Module({
  imports: [RankingModule, EditionsModule],
  controllers: [CompetitionController],
  providers: [CompetitionService, CompetitionGateway],
  exports: [CompetitionGateway],
})
export class CompetitionModule {}
