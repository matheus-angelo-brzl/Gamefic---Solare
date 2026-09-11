import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/categories.dto';
import { Access } from '@common/access/access.decorator';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Access('rh')
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }
}
