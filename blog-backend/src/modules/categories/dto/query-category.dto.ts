import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCategoryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 50;
}
