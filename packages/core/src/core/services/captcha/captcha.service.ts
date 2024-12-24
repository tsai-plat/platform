import { Injectable } from '@nestjs/common';
import {
  BizException,
  CacheKeyHelper,
  ErrorCodeEnum,
  PlatformEnum,
} from '@tsailab/common';

import * as svgCaptcha from 'svg-captcha-fixed';
import { RedisService } from '@tsailab/ioredis-mq';

@Injectable()
export class CaptchaService {
  protected readonly expires: number = 60;

  constructor(private readonly redisSevice: RedisService) {}

  /**
   *
   * @param nonce
   * @param platform
   * @returns captcha image data
   */
  async getCaptchaMath(
    nonce: string,
    platform: PlatformEnum = PlatformEnum.SYSTEM_PLATFORM,
  ) {
    const k = this.buildCacheKey(nonce, platform);

    const captcha = this.captchaMath();
    await this.redisSevice.setValueEx(k, captcha.text, this.expires);
    return captcha.data;
  }

  /**
   *
   * @param value required user input
   * @param nonce required, cookie
   * @param platform default system
   * @returns true or throw BizException
   */
  async validateCaptchaValue(
    value: string,
    nonce: string,
    platform: PlatformEnum = PlatformEnum.SYSTEM_PLATFORM,
  ) {
    if (!value?.length) {
      throw BizException.IllegalParamterError(`Require value`);
    }
    if (!nonce?.length) {
      throw BizException.IllegalParamterError(`验证码nonce未传值.`);
    }
    const k = this.buildCacheKey(nonce, platform);
    const v = await this.redisSevice.getValue<string>(k);
    if (!v || v !== value)
      throw BizException.createError(
        ErrorCodeEnum.PARAMS_INVALID,
        `验证码不正确或已失效!`,
      );

    return true;
  }

  private buildCacheKey(nonce: string, platform: PlatformEnum): string {
    return CacheKeyHelper.buildCaptchaKey(nonce, platform.toString());
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
