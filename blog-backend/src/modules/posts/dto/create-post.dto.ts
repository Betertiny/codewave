import { IsString, IsOptional, IsBoolean, IsArray, IsNumber, IsInt, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '文章slug (URL友好的唯一标识)' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional({ description: '文章摘要' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ description: '文章内容 (Markdown格式)' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '封面图片URL' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ description: '是否发布', default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: '标签ID数组' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tagIds?: number[];
}
