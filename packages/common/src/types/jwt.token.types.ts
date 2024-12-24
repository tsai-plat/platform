import { AccountType } from '../enums/account.type.enum';

export type ITokenBase = {
  iat: number;
  exp: number;
  iss: string;
  aud: string; // 受众 oauth appid or custom username
  sub: string; // 主题
};

export type IAccessBase = {
  version?: string;
  jti: string; // 32 位随机值防止重放攻击
  cid: string; // userno base36
  clit?: string; // client tag
  nonce?: string; // 用户判重标识
};

export type JwtAccessPayload = IAccessBase & {
  username: string; //用户名
  avatar?: string; // 头像
  id?: number; // userid
  orgno?: string;
  acctype?: AccountType;
  scopes?: Array<any>; // 扩展权限
  [k: string]: any;
} & Partial<ITokenBase>;

export type OAuth20AccessPayload = IAccessBase & {
  username: string; //用户名
  avatar?: string; // 头像
  esim?: string; // 加密 mobile
  scopes?: Array<any>; // 扩展权限
} & Partial<ITokenBase>;
