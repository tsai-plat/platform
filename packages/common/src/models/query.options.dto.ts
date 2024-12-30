import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPageParams } from '@tsailab/core-types';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';

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
