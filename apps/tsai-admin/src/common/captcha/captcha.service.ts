import { Injectable } from '@nestjs/common';
import { CacheKeyHelper } from '@tsailab/common';
import { NodeRedisService } from '@tsailab/node-redis';
import * as svgCaptcha from 'svg-captcha-fixed';
import { CaptchaObj } from 'svg-captcha-fixed';

@Injectable()
export class CaptchaService {
  protected readonly expires: number = 60;

  constructor(private readonly redisSevice: NodeRedisService) {}

  async getCaptchaMath(nonce: string) {
    const k = CacheKeyHelper.buildCaptchaKey(nonce);

    const captcha = this.captchaMath();
    await this.redisSevice.setValueEx(k, captcha.text, this.expires);
    return captcha.data;
  }

  private captchaMath(): CaptchaObj {
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
