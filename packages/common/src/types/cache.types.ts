import { IUser } from './user.interface';

export type CacheKeyScopeType =
  | 'systk'
  | 'custk'
  | 'guesttk'
  | 'captcha'
  | 'sms'
  | string;

export type CacheKeyEnumType = {
  [k: string]: CacheKeyScopeType;
};

export type TokenUserCache = IUser & {
  token: string;
};
