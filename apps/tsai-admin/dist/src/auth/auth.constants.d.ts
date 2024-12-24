import { CookieConfigSchema, JwtConfigSchmeaOptions, LotoCookiesType } from '@tsailab/common';
export declare const ROOT_APP_NAME = "TsAdminAPI";
export declare const JWT_YAML_CONF_KEY = "auth.jwt";
export declare const SYSTEM_TOKEN_HEADER = "tk";
export declare const defaultJwtOpts: Omit<JwtConfigSchmeaOptions, 'secretKey'>;
export declare const CaptchaCodeCookieKey: LotoCookiesType;
export declare const defaultCookieOpts: CookieConfigSchema;
