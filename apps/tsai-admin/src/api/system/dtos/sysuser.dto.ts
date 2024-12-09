/**
 * System Admin user dtos
 */

import { ApiProperty } from '@nestjs/swagger';
import { QueryOptionsDto } from '@tsailab/common';

export class QueryAdminUserReqDto extends QueryOptionsDto {
  @ApiProperty({ type: String, description: '查询条件:用户名或昵称' })
  username?: string;
  @ApiProperty({
    type: String,
    description: '查询条件:用户手机号码，支持模糊查询',
  })
  mobile?: string;
}

export class QueryAccountSelectionParams {
  orgid?: number;
  useStatusCtrl?: boolean;
}
