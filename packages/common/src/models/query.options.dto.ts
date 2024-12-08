import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { QueryPageParams } from '../types';

export class QueryOptionsDto implements QueryPageParams {
  @ApiPropertyOptional({
    required: false,
    description: 'Number of items displayed per page',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value ? Number(value) : value))
  readonly pageSize?: number;

  @ApiPropertyOptional({
    required: false,
    description: 'Current page number',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value ? Number(value) : value))
  readonly page?: number;

  @ApiPropertyOptional({
    required: false,
    description: 'query keywords',
  })
  @IsOptional()
  keywords?: string;
}
