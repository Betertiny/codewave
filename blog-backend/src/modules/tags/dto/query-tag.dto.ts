import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryTagDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 50;
}
