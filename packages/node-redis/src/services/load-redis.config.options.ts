import { ConfigService } from '@nestjs/config';
import {
  CacheRedisConfigSchema,
  MissConfigurationError,
} from '@tsailab/common';
import { NodeRedisModuleOptions, RedisConfigOptions } from '../types';
import { NODE_REDIS_CONFIG_KEY } from '../node-redis.constants';

export const loadCacheRedisConfigOptions = async (
  config: ConfigService,
): Promise<RedisConfigOptions> => {
  const configOpt = await config.get<CacheRedisConfigSchema | null>(
    NODE_REDIS_CONFIG_KEY,
    null,
  );

  if (!configOpt) {
    throw new MissConfigurationError(
      `Check app yaml config has ${NODE_REDIS_CONFIG_KEY} partion.`,
    );
  }
  const {
    url,
    host,
    port,
    db = 0,
    username,
    password,
    ttl,
  } = configOpt as CacheRedisConfigSchema;
  if (!url && (!host || !port)) {
    if (!host || !port) {
      throw new MissConfigurationError(
        `Expected one of :"url" ,(host & port).`,
      );
    }
  }

  let redisUrl = url;
  if (!redisUrl?.length) {
    redisUrl = `redis://${host}:${port}/${db}`;
  }

  const options: RedisConfigOptions = {
    url: redisUrl,
    host,
    port,
    db,
    username,
    password,
    ttl,
  };

  return options;
};

export function parseRedisClientOptions(
  moduleOptions: NodeRedisModuleOptions,
): RedisConfigOptions {
  const { config } = moduleOptions;
  if (!config) {
    throw new MissConfigurationError(`Check config has in moduleOptions.`);
  }

  const opts: RedisConfigOptions | undefined = Array.isArray(config)
    ? (config as RedisConfigOptions[]).length
      ? (config as RedisConfigOptions[])[0]
      : undefined
    : (config as RedisConfigOptions);

  if (!opts) {
    throw new MissConfigurationError(`Check config has in moduleOptions.`);
  }

  const { url, host, port, db, username, password, ttl } = opts;
  if (!url && (!host || !port)) {
    if (!host || !port) {
      throw new MissConfigurationError(
        `Expected one of :"url" ,(host & port).`,
      );
    }
  }

  let redisUrl = url;
  if (!redisUrl?.length) {
    redisUrl = `redis://${host}:${port}/${db}`;
  }

  return {
    url: redisUrl,
    host,
    port,
    db,
    username,
    password,
    ttl,
  } as RedisConfigOptions;
}
