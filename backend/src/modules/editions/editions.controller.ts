import { CreateEditionDto, UpdateEditionDto } from './dtos/editions.dto';
import { Controller, Body, Param, Get, Post, Patch } from '@nestjs/common';
import { Access } from '@common/access/access.decorator';
import { EditionsService } from './editions.service';

@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}

  @Get()
  async getAllEditions() {
    return await this.editionsService.getAllEditions();
  }

  @Get('/current')
  async getCurrentEdition() {
    return await this.editionsService.getCurrentEdition();
  }

  @Access('rh')
  @Post()
  async createEdition(@Body() dto: CreateEditionDto) {
    return this.editionsService.createEdition(dto);
  }

  @Access('rh')
  @Patch(':id')
  async updateEdition(@Param('id') id: string, @Body() dto: UpdateEditionDto) {
    return this.editionsService.updateEdition(id, dto);
  }
}
