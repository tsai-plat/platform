import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  isEmail,
  isMobilePhone,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import {
  ClientPlatforms,
  PasswordRegisteredAccount,
  PlatformEnum,
  QuickRegisteredAccount,
  UserStatusEnum,
} from '@tsailab/core-types';

export class QuickRegisteredUser implements QuickRegisteredAccount {
  @ApiProperty({
    name: 'account',
    description: 'entry an email or phone',
  })
  @ValidateIf(
    (_o, value) => {
      return isMobilePhone(value, 'zh-CN') || isEmail(value);
    },
    {
      message: '请输入手机号码或邮箱地址',
    },
  )
  @IsNotEmpty()
  account: string;

  @IsOptional()
  platform?: PlatformEnum;

  @ApiPropertyOptional({
    name: 'status',
    enum: UserStatusEnum,
    required: false,
  })
  @ValidateIf((o) => {
    if (typeof o.status !== 'undefined')
      return [UserStatusEnum.GUEST, UserStatusEnum.NORMAL].includes(
        o.status as UserStatusEnum,
      );

    return true;
  })
  @IsOptional()
  status?: UserStatusEnum;

  @IsOptional()
  code?: string;
}

export class CustomSigninDto implements PasswordRegisteredAccount {
  @ApiProperty({
    name: 'username',
    type: 'string',
    required: true,
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    name: 'phone',
    type: 'string',
    required: false,
    description: '电话邮箱二选一',
  })
  @ValidateIf(
    (_o, value) => {
      if (!value?.length) return true;
      return isMobilePhone(value, 'zh-CN');
    },
    {
      message: '请输入大陆地区手机号码',
    },
  )
  @IsOptional()
  phone?: string;
  @ApiProperty({
    name: 'email',
    type: 'string',
    required: false,
    description: '电话邮箱二选一',
  })
  @ValidateIf(
    (o, value) => {
      if (!value?.length && !o.phone?.length) return false;
      if (!value?.length) return true;
      return isEmail(value);
    },
    {
      message: '邮箱和手机至少填写一项.',
    },
  )
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'platform',
    enum: PlatformEnum,
  })
  @ValidateIf((o, value) => {
    if (value) {
      return ClientPlatforms.map((v) => v.toString()).includes(value);
    }
    return true;
  })
  @IsOptional()
  platform?: PlatformEnum;
  @IsOptional()
  status?: UserStatusEnum;
  @ApiProperty({
    name: 'code',
    type: 'string',
    required: false,
    description: '图形验证码',
  })
  @IsNotEmpty({ message: '请输入验证码' })
  code: string;
}
