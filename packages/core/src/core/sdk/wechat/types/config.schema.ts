export type WechatAuthorizeSchema = {
  appid: string;
  appsecret: string;
  redirectUrl?: string;
  cacheExpiresin?: number;
};
