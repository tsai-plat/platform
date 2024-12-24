import { JwtConfigSchmeaOptions } from '@tsailab/common';

export const JWT_YAML_CONF_KEY = 'auth.jwt';
export const SYSTEM_TOKEN_HEADER = 'tk';
export const defaultJwtOpts: Omit<JwtConfigSchmeaOptions, 'secretKey'> = {
  encrptRounds: 10,
  version: '1',
  iss: 'tsai',
  sub: 'tsai-api',
  expirein: 24 * 3600,
};
