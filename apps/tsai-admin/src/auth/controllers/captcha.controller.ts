import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';
import { CaptchaService } from '@tsai-platform/core';
import {
  CookieConfigSchema,
  HttpContentTypeEnum,
  RandomHelper,
} from '@tsailab/common';
import { CookieOptions, Response } from 'express';
import { CaptchaCodeCookieKey, defaultCookieOpts } from '../auth.constants';

@Controller('captcha')
export class CaptchaController {
  private logger = new Logger(CaptchaController.name);
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({
    summary: '获取验证图片',
  })
  @Get()
  async get(@Query('nonce') nonce: string, @Res() res: Response) {
    if (!nonce?.length) {
      nonce = RandomHelper.genRandomCacheKey();
    }

    await this.setCaptchaCookie(res, nonce);

    const captcha = await this.captchaService.getCaptchaMath(nonce);
    res.type(HttpContentTypeEnum.svgXml);
    res.status(HttpStatus.OK);
    res.send(captcha);
  }

  private async setCaptchaCookie(res: Response, value: string) {
    const { secret, secure, ...others } =
      await this.config.get<CookieConfigSchema>('cookie', defaultCookieOpts);

    const options: CookieOptions = {
      ...others,
      secure: secure || !!secret,
    };

    await res.cookie(CaptchaCodeCookieKey, value, {
      ...options,
    });
  }
}
