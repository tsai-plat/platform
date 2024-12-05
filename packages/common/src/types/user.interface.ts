import { AccountType, PlatformEnum, UserStatusEnum } from '../enums';

export interface IUserBase {
  id: number;
  userno: string; //unique in global
  username: string;
  phone: string;
  acctype: AccountType;
  status: UserStatusEnum;
  platform: PlatformEnum;
}

export interface IUser extends IUserBase {
  email?: string;
  password?: string;
  nickname?: string;
  avatar?: string;
  remark?: string;
  openid?: string;
  unionid?: string;
  [k: string]: any;
}

export interface IUserProfile {
  userno: string;
  name: string;
  openid?: string;
  unionid?: string;
  sex?: number;
}
