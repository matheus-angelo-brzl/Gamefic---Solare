import { CreateSubmissionDto } from './dtos/submissions.dto';
import { Controller, Body, Param, Get, Post, Req, Redirect } from '@nestjs/common';
import { Upload, File } from '@common/storage/storage.decorator';
import { Access } from '@common/access/access.decorator';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async getUserSubmissions(@Req() req: Express.Request) {
    return this.submissionsService.getUserSubmissions(req.user.id);
  }

  @Access('rh')
  @Get('pending')
  async getPendingSubmissions(@Req() req: Express.Request) {
    return this.submissionsService.getPendingSubmissions(req.user.id);
  }

  @Redirect()
  @Access('public')
  @Get('attachment/:path/:key')
  async getAttachment(@Param('path') path: string, @Param('key') key: string) {
    const url = await this.submissionsService.getAttachment(`${path}/${key}`);
    return { url };
  }

  @Post()
  @Upload('file')
  async createSubmission(
    @Body() dto: CreateSubmissionDto,
    @File() file: Express.Multer.File,
    @Req() req: Express.Request,
  ) {
    return this.submissionsService.createSubmission(req.user.id, dto, file);
  }
}
