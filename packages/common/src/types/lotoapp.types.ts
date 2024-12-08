import { IUserSession } from './session.interface';

export type LotoAppListener = {
  name: string;
  url: string;
};

export type LotoHeaderKeyType = 'x-loto-key' | 'x-loto-reqid';

export type LotoHeadersType = {
  LotoHeaderKeyType: string | string[] | undefined;
  uid?: number | undefined;
  orgno: string;
  reqid: string;
  cliid: string;
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
