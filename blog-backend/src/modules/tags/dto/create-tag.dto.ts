import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: '标签名称' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '标签slug (URL友好)' })
  @IsString()
  @MaxLength(50)
  slug: string;

  @ApiPropertyOptional({ description: '标签颜色' })
  @IsString()
  @IsOptional()
  color?: string;
}
