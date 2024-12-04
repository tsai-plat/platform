import { UserStatusEnum } from '../enums';

export interface IUserSession {
  userno: string; //unique in global
  username: string; // username or name
  avatar: string;
  phone: string;
  status: UserStatusEnum;
  [k: string]: any;
}
