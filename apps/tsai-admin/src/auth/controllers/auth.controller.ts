import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SigninLocalDto } from '../dtos';
import { Request } from 'express';
import { CaptchaCodeCookieKey } from '../auth.constants';
import { CaptchaService } from '@tsai-platform/core';
import { PlatformEnum } from '@tsailab/common';

@ApiTags('System Auth 模块')
@Controller()
export class AuthController {
  protected logger = new Logger(AuthController.name);
  constructor(private readonly captcha: CaptchaService) {}

  @ApiOperation({
    summary: '用戶名+密码登录',
    description: '用戶名+密码登录',
  })
  @Post('login')
  async login(@Req() req: Request, @Body() dto: SigninLocalDto) {
    if (!dto?.isLock) {
      const cookieValue = req.cookies[CaptchaCodeCookieKey];

      this.logger.log(`>>cookieValue>>>>${cookieValue}`, dto);
      // UI not lock screen required validate captcha code
      await this.captcha.validateCaptchaValue(
        dto?.code ?? '',
        cookieValue,
        PlatformEnum.SYSTEM_PLATFORM,
      );
    }

    return {
      ...dto,
    };
  }
}
