import { ApiProperty } from '@nestjs/swagger';
import { IsValidAccount } from '@tsailab/common';
import { IsNotEmpty } from 'class-validator';

export class VerifyCodeLoginDto {
  @ApiProperty({
    name: 'account',
    required: true,
    description: 'entry an email or phone',
  })
  @IsValidAccount({ message: `请输入邮箱地址或手机号码` })
  account: string;

  @ApiProperty({
    name: 'verifyCode',
    required: true,
    description: 'entry an email or phone verify code',
  })
  @IsNotEmpty({ message: '请输入验证码' })
  verifyCode: string;

  cookieKey?: string;
}
