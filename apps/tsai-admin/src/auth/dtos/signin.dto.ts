import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class SigninLocalDto {
  @ApiProperty({
    required: true,
    name: 'account',
    description: 'login account: username,userno,phone or email',
  })
  @IsNotEmpty()
  account: string; // username,uno,email or phone

  @ApiProperty({
    name: 'password',
    required: true,
    description: `用户密码`,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'code',
    required: true,
    description: `验证码`,
  })
  @ValidateIf((o) => !o.isLock && !o?.code?.trim()?.length, {
    message: '请输入验证码',
  })
  code?: string;

  isLock?: boolean;
  cookieValue?: string;
}
