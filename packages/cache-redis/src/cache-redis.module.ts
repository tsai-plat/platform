import {
  DynamicModule,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  RedisClients,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from './interfaces';
import { RedisIOService } from './services';
import {
  createAsyncProviders,
  createOptionsProvider,
  mergedOptionsProvider,
  redisClientsProvider,
} from './redis';
import { ValidateConfigurationError } from './errors';
import { REDIS_IO_CLIENTS, REDIS_MERGED_OPTIONS } from './redis.constants';
import { isError, parseNamespace } from './utils';
import { ERROR_LOG, redisLogger } from './log';

@Module({})
export class CacheRedisModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  static forRoot(
    options: RedisModuleOptions = {},
    isGlobal = true,
  ): DynamicModule {
    const providers: Provider[] = [
      createOptionsProvider(options),
      redisClientsProvider,
      mergedOptionsProvider,
      RedisIOService,
    ];

    return {
      global: isGlobal,
      module: CacheRedisModule,
      providers,
      exports: [],
    };
  }

  static forRootAsync(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    if (!options.useFactory && !options.useClass && !options.useExisting) {
      throw new ValidateConfigurationError();
    }

    const providers: Provider[] = [
      ...createAsyncProviders(options),
      redisClientsProvider,
      mergedOptionsProvider,
      ...(options.extraProviders ?? []),
    ];

    return {
      global: isGlobal,
      module: CacheRedisModule,
      imports: options.imports,
      providers,
      exports: [RedisIOService],
    };
  }

  async onApplicationShutdown(_signal?: string) {
    const { colseClient } = this.moduleRef.get<RedisModuleOptions>(
      REDIS_MERGED_OPTIONS,
      {
        strict: false,
      },
    );

    if (colseClient) {
      const clients = this.moduleRef.get<RedisClients>(REDIS_IO_CLIENTS, {
        strict: false,
      });

      for (const [namespace, client] of clients) {
        if (client.status === 'end') continue;
        if (client.status === 'ready') {
          try {
            await client.quit();
          } catch (e) {
            if (isError(e))
              redisLogger.error(
                ERROR_LOG(parseNamespace(namespace), e.message),
                e.stack,
              );
          }

          continue;
        }

        client.disconnect();
      }
    }
  }
}
