import { Redis } from 'ioredis';
import {
  Namespace,
  RedisClientOptions,
  RedisModuleOptions,
} from '../interfaces';
import { DEFAULT_REDIS, NAMESPACE_KEY } from '../redis.constants';
import { ERROR_LOG, READY_LOG, redisLogger } from '../log';
import { get, parseNamespace } from '../utils';

/**
 *
 * @param param0 RedisClientOptions
 * @param param1 RedisModuleOptions
 * @returns ioredis Redis
 */
export const createClient = (
  {
    namespace,
    url,
    path,
    onClientCreated,
    ...redisOptions
  }: RedisClientOptions,
  { readyLog, errorLog }: RedisModuleOptions,
): Redis => {
  let client: Redis;

  if (url) {
    client = new Redis(url, redisOptions);
  } else if (path) {
    client = new Redis(path, redisOptions);
  } else {
    client = new Redis(redisOptions);
  }

  Reflect.defineProperty(client, NAMESPACE_KEY, {
    value: namespace ?? DEFAULT_REDIS,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  if (readyLog) {
    client.on('ready', () => {
      redisLogger.log(
        READY_LOG(parseNamespace(get<Namespace>(client, NAMESPACE_KEY))),
      );
    });
  }

  if (errorLog) {
    client.on('error', (err: Error) => {
      redisLogger.error(
        ERROR_LOG(
          parseNamespace(get<Namespace>(client, NAMESPACE_KEY)),
          err.message,
        ),
        err.stack,
      );
    });
  }

  if (onClientCreated) onClientCreated(client);

  return client;
};
