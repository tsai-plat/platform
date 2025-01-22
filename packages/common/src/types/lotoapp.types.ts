import { type IUserSession } from '@tsailab/core-types';
export type LotoAppListener = {
  name: string;
  url: string;
};
export type LotoCookiesType = 'captcha-code' | 'sms-code';
export type LotoHeaderKeyType = 'x-loto-key' | 'x-loto-reqid';

export type LotoHeadersType = {
  LotoHeaderKeyType: string | string[] | undefined;
  uid?: number | undefined;
  uno?: string;
  username?: string;
  orgno: string;
  reqid: string;
  cliid: string;
  clit?: string;
  ip: string;
  session?: IUserSession;
  [k: string]: any;
};

export type LotoModuleRouteType = {
  name: string;
  modulePath: string;
  desc?: string;
  [k: string]: string;
};
