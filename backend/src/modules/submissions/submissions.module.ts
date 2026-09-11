import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { EditionsService } from '@modules/editions/editions.service';

@Module({
  imports: [],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, EditionsService],
})
export class SubmissionsModule {}
