/**
 * System Admin user dtos
 */

import { ApiProperty } from '@nestjs/swagger';
import { QueryOptionsDto } from '@tsailab/common';
import { IsNotEmpty } from 'class-validator';

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

export class ResetSysUserPwdDto {
  @ApiProperty({ type: Number, description: '用户ID' })
  id: number;
  @ApiProperty({ type: String, description: '新密码' })
  @IsNotEmpty({ message: '新密码不能为空' })
  password: string;
}
