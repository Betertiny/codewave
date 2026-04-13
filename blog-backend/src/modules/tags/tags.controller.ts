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
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto, QueryTagDto } from './dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: '创建标签' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: '获取标签列表' })
  findAll(@Query() query: QueryTagDto) {
    return this.tagsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: '获取单个标签' })
  findOne(@Param('slug') slug: string) {
    return this.tagsService.findOne(slug);
  }

  @Get(':slug/posts')
  @ApiOperation({ summary: '获取标签下的文章' })
  findPostsByTag(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.tagsService.findBySlugWithPosts(slug, page, pageSize);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新标签' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
