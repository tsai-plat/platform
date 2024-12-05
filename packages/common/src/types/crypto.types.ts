// https://github.com/auth0/node-jsonwebtoken#algorithms-supported
export type JwtAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

export type AESOptionsType = {
  alg: string;
  iv: string; // iv base64
  key: string; // key base64
};
