import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SigninLocalDto } from '../dtos';
import { Request } from 'express';
import { CaptchaCodeCookieKey } from '../auth.constants';
import { CaptchaService, CurrentUser, PublicApi } from '@tsai-platform/core';
import { AuthService } from '../services/auth.service';
import { IUser, PlatformEnum } from '@tsailab/core-types';

@ApiTags('System Auth 模块')
@Controller()
export class AuthController {
  protected logger = new Logger(AuthController.name);
  constructor(
    private readonly captcha: CaptchaService,
    private readonly authService: AuthService,
  ) {}

  @PublicApi()
  @ApiOperation({
    summary: '用戶名+密码登录',
    description: '用戶名+密码登录',
  })
  @Post('login')
  async login(@Req() req: Request, @Body() dto: SigninLocalDto) {
    const cookieValue = req.cookies[CaptchaCodeCookieKey];
    if (!dto?.isLock) {
      // UI not lock screen required validate captcha code
      await this.captcha.validateCaptchaValue(
        dto?.code ?? '',
        cookieValue,
        PlatformEnum.SYSTEM_PLATFORM,
      );
    }

    return await this.authService.login({ ...dto, cookieValue });
  }

  @Get('userinfo')
  async getUserInfo(@CurrentUser() user: IUser) {
    return user;
  }
}
