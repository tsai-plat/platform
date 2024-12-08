import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { NodeRedisOptionsFactory } from './redis.module.interface';

/**
 * node-redis client url
 * example url
 *  `redis://${host}:${port}/${db}`
 */
export interface RedisConfigOptions {
  url?: string;
  host?: string;
  port?: number;
  db: number;
  username?: string;
  password?: string;
  ttl?: number;
}

/**
 *
 * forRoot options
 * @publicApi
 */
export interface NodeRedisModuleOptions {
  config?: RedisConfigOptions | RedisConfigOptions[];
  readyLog?: boolean;
  errorLog?: boolean;
}

/**
 * Options for dynamically configuring the node-redis module
 *
 * @see [Async Configuration](https://docs.nestjs.com/fundamentals/dynamic-modules)
 * @publicApi
 *
 */
export interface NodeRedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   *
   */
  useClass?: Type<NodeRedisOptionsFactory>;
  /**
   *
   */
  useEsisting?: Type<NodeRedisOptionsFactory>;

  useFactory?: (
    ...args: any[]
  ) => Promise<NodeRedisModuleOptions> | NodeRedisModuleOptions;

  /**
   * Dependencies that a factory may inject
   *
   */
  inject?: any[];

  /**
   * extraProviders is used when you use useClass
   * in useClass you're using a class to configure the NodeRedis module
   * Sometime that class has some dependencies like ConfigModule and ConfigService
   *
   */
  extraProviders?: Provider[];
}
