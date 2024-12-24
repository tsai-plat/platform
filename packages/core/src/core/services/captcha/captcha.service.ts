import { Injectable } from '@nestjs/common';
import { CacheKeyHelper, PlatformEnum } from '@tsailab/common';

import * as svgCaptcha from 'svg-captcha-fixed';
import { RedisService } from '@tsailab/ioredis-mq';

@Injectable()
export class CaptchaService {
  protected readonly expires: number = 60;

  constructor(private readonly redisSevice: RedisService) {}

  async getCaptchaMath(
    nonce: string,
    platform: PlatformEnum = PlatformEnum.SYSTEM_PLATFORM,
  ) {
    const k = CacheKeyHelper.buildCaptchaKey(nonce, platform.toString());

    const captcha = this.captchaMath();
    await this.redisSevice.setValueEx(k, captcha.text, this.expires);
    return captcha.data;
  }

  private captchaMath() {
    const captcha = svgCaptcha.createMathExpr({
      mathMax: 35,
      mathMin: 1,
      mathOperator: '+-',
      fontSize: 50,
      width: 120,
      height: 36,
      background: '#cc9966',
    });

    return captcha;
  }
}
