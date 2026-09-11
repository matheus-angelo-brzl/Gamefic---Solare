import type { Request } from 'express';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { Access } from '@common/access/access.decorator';
import { TasksService } from './tasks.service';

@Access('rh')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Access()
  @Get()
  async getActiveTasks() {
    return this.tasksService.getActiveTasks();
  }

  @Post()
  async createTask(@Body() dto: CreateTaskDto, @Req() req: Request) {
    return this.tasksService.createTask(dto, req.user.id);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
