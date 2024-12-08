import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ApiOperation } from '@nestjs/swagger';
import { HttpContentTypeEnum, RandomHelper } from '@tsailab/common';
import { Response } from 'express';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @ApiOperation({
    summary: '获取验证图片',
  })
  @Get()
  async get(@Query('nonce') nonce: string, @Res() res: Response) {
    if (!nonce?.length) {
      nonce = RandomHelper.genRandomCacheKey();
    }

    const captcha = await this.captchaService.getCaptchaMath(nonce);
    res.setHeader('Loto-Captch-Code', nonce);
    res.type(HttpContentTypeEnum.svgXml);
    res.status(HttpStatus.OK);
    res.send(captcha);
  }
}
