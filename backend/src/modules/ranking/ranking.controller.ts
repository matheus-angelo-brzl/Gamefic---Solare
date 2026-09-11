import { Controller, Get, Param, Req, BadRequestException } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get(':scope')
  async getRankings(@Param('scope') scope: string, @Req() req: Express.Request) {
    switch (scope) {
      case 'edition':
        return this.rankingService.getCurrentEditionRanking(req);
      case 'annual':
        return this.rankingService.getAnnualRanking();
      case 'general':
        return this.rankingService.getGeneralRanking();
      default:
        throw new BadRequestException('Escopo de ranking inválido');
    }
  }
}
