import { ConfigService } from '@nestjs/config';
import { NODE_REDIS_CONFIG_KEY } from '../node-redis.constants';
import {
  CacheRedisConfigSchema,
  MissConfigurationError,
} from '@tsailab/common';
import { createClient } from 'redis';
import { RedisClient } from './redis.client.type';

export const nodeRedisClientFactory = async (
  config: ConfigService,
): Promise<RedisClient | never> => {
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
    password,
  } = configOpt as CacheRedisConfigSchema;

  let redisUrl: string | undefined = url;
  if (!redisUrl) {
    if (!host || !port) {
      throw new MissConfigurationError(
        `Expected one of :"url" ,(host & port).`,
      );
    }

    redisUrl = `redis://${host}:${port}/${db}`;
  }

  const client: RedisClient = createClient({
    url: redisUrl,
    password,
  });

  await client.connect();
  return client;
};
