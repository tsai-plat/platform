export type CacheKeyScopeType = 'systk' | 'custk' | 'captcha' | 'sms' | string;

export type CacheKeyEnumType = {
  [k: string]: CacheKeyScopeType;
};
