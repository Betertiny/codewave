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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from './dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '创建文章' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表 (分页)' })
  @ApiResponse({ status: 200, description: '返回文章列表' })
  findAll(@Query() query: QueryPostDto) {
    return this.postsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: '获取文章详情' })
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
