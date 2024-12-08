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

  static buildSysTokenKey(uid: number): string {
    return combineCacheKey(CacheKeyScope.SYSTEM_TOKEN, 'uid', uid);
  }

  static buildCustomTokenKey(uid: number): string {
    return combineCacheKey(CacheKeyScope.CUSTOM_TOKEN, 'uid', uid);
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
