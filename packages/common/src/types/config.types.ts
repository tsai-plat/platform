import { JwtAlgorithm } from './crypto.types';

export type StageEnvType = 'prod' | 'dev' | 'test' | 'stage';

export type AppConfigSchema = {
  name?: string;
  upload?: {
    data: string;
    tmp?: string;
    userfiles?: string;
    sql?: string;
  };
  server: {
    port: number;
  };
};

export type MysqlDBConfigSchema = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  logging?: boolean;
  synchronize?: boolean;
  autoLoadEntities?: boolean;
};

// cache.redis
export type CacheRedisConfigSchema = {
  url?: string;
  host?: string;
  port?: number;
  db: number;
  password?: string | undefined;
  username?: string | undefined;
  ttl?: number;
};

export type GlobalConfigSchema = {
  app: AppConfigSchema;
  mysql: MysqlDBConfigSchema;
  cache: {
    redis: CacheRedisConfigSchema;
    [c: string]: any;
  };
  [k: string]: any;
};

/**
 * @public
 * Application Auth Jwt config schema
 *  iss: issuer which signed token
 *  sub: who will recieved token
 *  aud: audience who will recieved token
 *  expirein: the session expire in seconds or timeunit
 *    can 1d:one day 12h: 12 hours or 60: 60 seconds
 *  privateKey and publicKey when algorithm not HS*
 */
export type JwtConfigSchmeaOptions = {
  version?: string;
  algorithm?: JwtAlgorithm;
  encrptRounds?: number;
  iss: string;
  sub: string;
  aud?: string;
  expirein?: string | number;
  secretKey: string;
  privateKey?: string;
  publicKey?: string; // only use in not HS*
};
/**
 * @public
 * Cookie config:
 *  secret: boolean ,string or string[]
 *    Enables the Secure Set-Cookie attribute.
 *    When enabled, clients will only send the cookie back if the browser has a HTTPS connection.
 *  maxAge: The cookie storage model specification states that if both expires and maxAge are set,
 *      then maxAge takes precedence, but it is possible not all clients by obey this,
 *      so if both are set, they should point to the same date and time
 * @see https://www.npmjs.com/package/cookie
 *
 */
export type CookieConfigSchema = {
  secret?: string;
  httpOnly?: boolean;
  secure?: boolean;
  maxAge: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  [k: string]: any;
};

/**
 * default 1800 max 7200
 * durationSeconds like: 3600 or 60*60*2
 */
export type TecentObsSchema = {
  durationSeconds?: string | number;
  appid: string;
  secretId: string;
  secretKey: string;
  bucket: string;
  region: string;
  cdn: string;
  endpoint?: string;
  allowPrefix?: string;
  followRedirect?: boolean;
  storageClass?:
    | 'STANDARD'
    | 'STANDARD_IA'
    | 'ARCHIVE'
    | 'DEEP_ARCHIVE'
    | 'INTELLIGENT_TIERING'
    | 'MAZ_STANDARD'
    | 'MAZ_STANDARD_IA'
    | 'MAZ_INTELLIGENT_TIERING';
};

export type AliObsSchema = {
  durationSeconds?: string | number;
  appid: string;
  secretId: string;
  secretKey: string;
  bucket: string;
  region: string;
  cdn: string;
};
