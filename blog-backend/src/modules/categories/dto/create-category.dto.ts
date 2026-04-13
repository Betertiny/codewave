import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称', example: '云安全' })
  @IsString()
  name: string;

  @ApiProperty({ description: '分类 slug', example: 'cloud-security' })
  @IsString()
  slug: string;

  @ApiProperty({ description: '分类图标', example: 'cloud', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: '分类颜色', example: '#3B82F6', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ description: '排序顺序', example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
