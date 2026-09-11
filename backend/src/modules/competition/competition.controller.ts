import { BuffUserDto, EvaluateSubmissionDto } from './dtos/competition.dto';
import { Controller, Patch, Post, Body, Req } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { Access } from '@common/access/access.decorator';
import { EditionsService } from '@modules/editions/editions.service';

@Access('public')
@Controller('competition')
export class CompetitionController {
  constructor(
    private readonly competitionService: CompetitionService,
    private readonly editionsService: EditionsService,
  ) {}

  @Access('rh')
  @Patch('/evaluate')
  evaluateSubmission(@Body() dto: EvaluateSubmissionDto, @Req() req: Express.Request) {
    return this.competitionService.evaluateSubmission(dto, req.user.id);
  }

  /* ADMIN / TESTE - Remover depois */
  @Post('buff')
  async buffUser(@Body() dto: BuffUserDto) {
    const currentEdition = await this.editionsService.getCurrentEdition();
    return this.competitionService.testAddXp(dto.userId, currentEdition.id, dto.buff);
  }

  @Post('close')
  async closeEdition() {
    const currentEdition = await this.editionsService.getCurrentEdition();
    return this.competitionService.closeEdition(currentEdition.id);
  }

  @Post('broadcast')
  async broadcastRankingUpdate() {
    return this.competitionService.broadCast();
  }
}
