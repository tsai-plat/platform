import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomSigninDto, QuickRegisteredUser } from '../dto';
import { LotoHeadersType } from '@tsailab/common';
import { CustomRegisteredService } from '../services/registered.service';
import {
  ClientCaptchaService,
  LotoHeaders,
  PublicApi,
} from '@tsai-platform/core';
import { Request } from 'express';
import { CaptchaCodeCookieKey } from '../auth.constants';
import { PlatformEnum, UserStatusEnum } from '@tsailab/core-types';

@ApiTags('PC Auth 模块')
@Controller()
export class AuthController {
  constructor(
    private readonly registService: CustomRegisteredService,
    private readonly captcha: ClientCaptchaService,
  ) {}

  @PublicApi()
  @ApiOperation({
    summary: '快速注册',
  })
  @Post('mob/quicksignin')
  async quickRegistered(
    @Req() req: Request,
    @Body() dto: QuickRegisteredUser,
    @LotoHeaders() headers: LotoHeadersType,
  ) {
    const {
      account,
      platform = PlatformEnum.MOB_PLATFORM,
      code = '',
      status = UserStatusEnum.GUEST,
    } = dto;
    const cookieValue = req.cookies[CaptchaCodeCookieKey];

    await this.captcha.validateCaptchaValue(code, cookieValue);
    return this.registService.quickSignin(
      { account, status, platform, code },
      headers,
    );
  }

  @PublicApi()
  @ApiOperation({
    summary: '用户注册',
  })
  @Post('mob/signin')
  async customSignin(
    @Req() req: Request,
    @Body() dto: CustomSigninDto,
    @LotoHeaders() headers: LotoHeadersType,
  ) {
    const {
      username,
      password,
      phone,
      email,
      code,
      status = UserStatusEnum.NORMAL,
      platform = PlatformEnum.MOB_PLATFORM,
    } = dto;
    const cookieValue = req.cookies[CaptchaCodeCookieKey];
    await this.captcha.validateCaptchaValue(code, cookieValue);

    return this.registService.registeredCustomAccount(
      {
        username,
        password,
        phone,
        email,
        status,
        code,
        platform,
      },
      headers,
    );
  }
}
