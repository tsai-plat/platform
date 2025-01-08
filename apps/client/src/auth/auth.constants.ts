import {
  CookieConfigSchema,
  JwtConfigSchmeaOptions,
  LotoCookiesType,
} from '@tsailab/common';

export const ROOT_APP_NAME = 'TsaiClientAPI';
export const JWT_YAML_CONF_KEY = 'auth.jwt';

export const defaultJwtOpts: Omit<JwtConfigSchmeaOptions, 'secretKey'> = {
  encrptRounds: 10,
  version: '1',
  iss: 'tsai',
  sub: 'tsai-api',
  expirein: 24 * 3600,
};

export const CaptchaCodeCookieKey: LotoCookiesType = 'captcha-code';

export const defaultCookieOpts: CookieConfigSchema = {
  secret: 'tsai-client',
  httpOnly: true,
  maxAge: 60 * 5 * 1000,
  secure: true,
  SameSite: 'Lax',
  path: '/',
};
