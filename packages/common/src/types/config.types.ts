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
  host: string;
  port: number;
  db: string;
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
