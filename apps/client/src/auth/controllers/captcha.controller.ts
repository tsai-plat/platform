import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientCaptchaService, PublicApi } from '@tsai-platform/core';
import { CookieConfigSchema, RandomHelper } from '@tsailab/common';
import { HttpContentTypeEnum } from '@tsailab/core-types';
import { CliRestfulAPIModules } from 'src/api/restful.module.constants';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CaptchaCodeCookieKey, defaultCookieOpts } from '../auth.constants';
import { isEmail } from 'class-validator';

@ApiTags(`${CliRestfulAPIModules.authorization.name} Captcha`)
@Controller('captcha')
export class CaptchaController {
  constructor(
    private readonly captchaService: ClientCaptchaService,
    private readonly config: ConfigService,
  ) {}

  @PublicApi()
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

  @PublicApi()
  @ApiOperation({
    summary: '发送验证码',
  })
  @Post('send_code/:account')
  @Get('send_code/:account')
  sendVerifyCode(@Param('account') account: string) {
    if (isEmail(account)) {
    } else {
    }
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
