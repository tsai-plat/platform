import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BizException,
  ErrorCodeEnum,
  isMiddelPassword,
  isSimplePassword,
  isStrongPassword,
} from '@tsailab/common';

const CLIENT_CONFIG_PREFIX = 'custom';
@Injectable()
export class ClientConfigService {
  protected seeds: string[] = ['6489'];
  private pwdSecurityLevel: string = 'middle';
  public readonly suserDefaultPw: string;
  public readonly encrptRounds: number;

  constructor(private readonly config: ConfigService) {
    const conf = config.get(`${CLIENT_CONFIG_PREFIX}.unoSeeds`, null);
    if (conf && Array.isArray(conf)) {
      let unoSeeds = conf as unknown as string[];
      unoSeeds = unoSeeds
        .filter((v) => /[\d]{1,4}/.test(v))
        .map((v) => `000${v}`.slice(-4));

      this.seeds = [...unoSeeds];
    }
    this.pwdSecurityLevel = this.config.get<string>(
      `${CLIENT_CONFIG_PREFIX}.pwdSecurityLevel`,
      'middle',
    );

    this.encrptRounds = this.config.get<number>(
      `${CLIENT_CONFIG_PREFIX}.encrptRounds`,
      10,
    );
    this.suserDefaultPw = this.config.get<string>(
      `${CLIENT_CONFIG_PREFIX}.defaultPassword`,
      'tsai!123456',
    );
  }

  public get unoSeeds(): string[] {
    return this.seeds;
  }

  /**
   * verify password strength
   * @param passport
   * @returns true or throw BizException
   */
  verifyPasswordStrength(passport: string = '') {
    if (!passport?.length)
      throw BizException.createError(
        ErrorCodeEnum.PASSPORT_UNSAFE,
        `Password is too simple.`,
      );
    switch (this.pwdSecurityLevel) {
      case 'simple':
        if (!isSimplePassword(passport))
          throw BizException.createError(
            ErrorCodeEnum.PASSPORT_UNSAFE,
            `Password is too simple.`,
          );
        break;
      case 'middle':
        if (!isMiddelPassword(passport))
          throw BizException.createError(
            ErrorCodeEnum.PASSPORT_UNSAFE,
            `Password is too simple.`,
          );
        break;
      case 'strong':
        if (!isStrongPassword(passport))
          throw BizException.createError(
            ErrorCodeEnum.PASSPORT_UNSAFE,
            `Password is too simple.`,
          );
        break;
      default:
        if (!isMiddelPassword(passport))
          throw BizException.createError(
            ErrorCodeEnum.PASSPORT_UNSAFE,
            `Password is too simple.`,
          );
        break;
    }

    return true;
  }
}
