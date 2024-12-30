import { ApiProperty } from '@nestjs/swagger';
import { QueryOptionsDto } from '@tsailab/common';
import { IsNotEmpty } from 'class-validator';

export class QuerySubRegionOptionModel extends QueryOptionsDto {
  @ApiProperty({ name: 'pid', description: '上级行政区划ID' })
  @IsNotEmpty()
  pid: number;
}
