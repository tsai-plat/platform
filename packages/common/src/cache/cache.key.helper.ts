import { AccountType, AccountTypeEnum } from '../enums';
import { CacheKeyScopeType } from '../types';
import { CacheKeyScope } from './cache.scopes';

export const CacheKeySplitor = ':';

export class CacheKeyHelper {
  /**
   *
   * @param scopes
   * @returns key string
   */
  static buildRedisKey(...scopes: Array<string | number>): string {
    return combineCacheKey(...scopes);
  }

  static buildScopeKey(scope: string, id: string | number): string {
    return combineCacheKey(...[scope, id]);
  }

  /**
   *
   * @param uid required
   * @param acctype default custom
   * @returns string
   */
  static buildAccessTokenKey(
    uid: number,
    clit: string,
    acctype: AccountType = AccountTypeEnum.CUSTOM,
  ) {
    let tkScope: CacheKeyScopeType;
    switch (acctype) {
      case AccountTypeEnum.SYSTEM:
        tkScope = CacheKeyScope.SYSTEM_TOKEN;
        break;
      case AccountTypeEnum.CUSTOM:
        tkScope = CacheKeyScope.CUSTOM_TOKEN;
        break;

      default:
        tkScope = CacheKeyScope.GUEST_TOKEN;
        break;
    }

    return combineCacheKey(tkScope, 'uid', uid, clit);
  }

  static buildCaptchaKey(uuid: string | number, props: string = ''): string {
    return combineCacheKey(CacheKeyScope.CAPTCH_CODE, props, uuid);
  }

  static buildSmsKey(phone: string): string {
    return combineCacheKey(CacheKeyScope.SMS_CODE, 'phone', phone);
  }
}

export function combineCacheKey(...args: Array<string | number>): string {
  return args
    .filter((v) => v !== undefined && ('' + v).length)
    .join(CacheKeySplitor);
}
