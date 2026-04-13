import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAboutDto {
  @ApiPropertyOptional({ description: '标题' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '内容 (Markdown)' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: '社交链接 (JSON)' })
  @IsOptional()
  socialLinks?: any;
}
