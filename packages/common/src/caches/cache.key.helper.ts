import { CacheKeyScope } from './cache.key.enum';

export const CacheKeySplitor = ':';

export class CacheKeyHelper {
  /**
   *
   * @param scopes
   * @returns key string
   */
  static buildRedisKey(...scopes: Array<string | number>): string {
    return combineKey(...scopes);
  }

  static buildScopeKey(scope: string, id: string | number): string {
    return combineKey(...[scope, id]);
  }

  static buildSysTokenKey(uid: number): string {
    return combineKey(CacheKeyScope.SYSTEM_TOKEN, 'uid', uid);
  }

  static buildCustomTokenKey(uid: number): string {
    return combineKey(CacheKeyScope.CUSTOM_TOKEN, 'uid', uid);
  }

  static buildCaptchaKey(uuid: string | number): string {
    return combineKey(CacheKeyScope.CAPTCH_CODE, uuid);
  }

  static buildSmsKey(phone: string): string {
    return combineKey(CacheKeyScope.SMS_CODE, 'phone', phone);
  }
}

function combineKey(...args: Array<string | number>): string {
  return args
    .filter((v) => v !== undefined && ('' + v).length)
    .join(CacheKeySplitor);
}
