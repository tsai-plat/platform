import { CacheKeyEnumType } from '@tsailab/core-types';

export const CacheKeyScope: CacheKeyEnumType = {
  SYSTEM_TOKEN: 'systk',
  CUSTOM_TOKEN: 'custk',
  GUEST_TOKEN: 'guesttk',
  CAPTCH_CODE: 'captch',
  SMS_CODE: 'sms',
  NEXTNO_LIST: 'nolist',
  NEXTNO_HASH: 'nohash',
  WECHAT_AUTH_TOKEN: 'wxtk',
  VENDOR_TOKEN: 'vendortk',
};
