import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from './dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '创建分类' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取分类列表' })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: '获取单个分类' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Get(':slug/posts')
  @ApiOperation({ summary: '获取分类下的文章' })
  findPostsByCategory(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.categoriesService.findBySlugWithPosts(slug, page, pageSize);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新分类' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
