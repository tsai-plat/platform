import { AccountType, UserStatusEnum } from '../enums';

/**
 * Server side User session
 */
export interface IUserSession {
  uid?: number;
  userno: string; //unique in global
  username: string; // username or name
  avatar: string;
  phone: string;
  status: UserStatusEnum;
  acctype: AccountType;
  orgno?: string;
  [k: string]: any;
}
