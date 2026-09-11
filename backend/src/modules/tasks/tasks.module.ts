import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { EditionsService } from '@modules/editions/editions.service';
import { CategoriesService } from '@modules/categories/categories.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksService, EditionsService, CategoriesService],
})
export class TasksModule {}
