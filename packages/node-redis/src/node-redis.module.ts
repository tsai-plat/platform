import { DynamicModule, Module } from '@nestjs/common';
import { NodeRedisModuleOptions } from './types';
import { DEFAULT_NODE_REDIS_CLIENT } from './node-redis.constants';
import { parseRedisClientOptions } from './services/load-redis.config.options';
import { createClient } from 'redis';
import { NodeRedisService } from './services';

@Module({})
export class NodeRedisModule {
  /**
   *
   */
  public static forRoot(
    options: NodeRedisModuleOptions,
    isGlobal: boolean = true,
  ): DynamicModule {
    const { url, username, password } = parseRedisClientOptions(options);

    const redisClientProvider = {
      provide: DEFAULT_NODE_REDIS_CLIENT,
      useValue: createClient({
        url: url,
        username,
        password,
      }),
    };

    return {
      module: NodeRedisModule,
      global: isGlobal,
      providers: [redisClientProvider, NodeRedisService],
      exports: [NodeRedisService],
    };
  }

  public static forRootAsync() {}
}
