import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BizException, CacheKeyHelper, RandomHelper } from '@tsailab/common';
import { RedisService } from '@tsailab/ioredis-mq';
import { isEmail, isMobilePhone } from 'class-validator';

@Injectable()
export class VerifyCodeService {
  private logger = new Logger(VerifyCodeService.name);

  private debug: boolean = false;
  private codeExpirein = 300;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.debug = ['1', 'on', 'true', true, 1].includes(
      this.configService.get<string>('app.verbose', 'off'),
    );
    const expires = this.configService.get<string>(
      'customLogin.codeExpirein',
      '',
    );
    if (/[\d]+/.test(expires)) {
      const et = parseInt(expires);
      if (et > 30 && et < 24 * 3600) {
        this.codeExpirein = et;
      }
    }
  }

  /**
   * call this before  verify mobile is in DB user
   * @param mobile
   */
  async sendMobileVerifyCode(mobile: string): Promise<string> {
    if (!isMobilePhone(mobile, 'zh-CN'))
      throw BizException.IllegalParamterError(`phone number illegal.`);

    const k = this.buildCacheKey(mobile, 'phone');
    const code = RandomHelper.randomNumberCode();
    await this.redisService.setValueEx(k, code, this.codeExpirein);
    if (this.debug) {
      this.logger.warn(
        `login account ${mobile}[${code}],expire at: ${new Date(Date.now() + this.codeExpirein * 1000).toUTCString()}`,
      );
    }
    return code;
  }

  /**
   * 校验验证码,验证通过后删除缓存，
   * 保证只验证一次
   * @param account
   * @param code
   * @returns boolean
   */
  async verifyCode(account: string, code: string): Promise<boolean> {
    if (isEmail(account)) {
      const ek = this.buildCacheKey(account, 'email');
      const cacheCode = await this.redisService.getValue(ek);

      const b = cacheCode && cacheCode === code;
      if (b) {
        await this.redisService.deleteKey(ek);
      }

      return b;
    } else if (isMobilePhone(account, 'zh-CN')) {
      const mk = this.buildCacheKey(account, 'phone');
      const cacheCode = await this.redisService.getValue(mk);
      const b = cacheCode && cacheCode === code;
      if (b) {
        await this.redisService.deleteKey(mk);
      }
      return b;
    } else {
      return false;
    }
  }

  /**
   * call this before  verify email is in DB user
   * @param mobile
   */
  async sendEmailVerifyCode(email: string): Promise<string> {
    if (!isEmail(email))
      throw BizException.IllegalParamterError(`email address illegal.`);

    const k = this.buildCacheKey(email, 'email');
    const code = RandomHelper.randomNumberCode();
    await this.redisService.setValueEx(k, code, this.codeExpirein);

    if (this.debug) {
      this.logger.warn(
        `login account ${email}[${code}],expire at: ${new Date(Date.now() + this.codeExpirein * 1000).toUTCString()}`,
      );
    }

    return code;
  }

  private buildCacheKey(account: string, scope: string = 'email') {
    return CacheKeyHelper.buildVerifyKey(scope, account);
  }
}
