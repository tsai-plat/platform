import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import {
  RedisClients,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisOptionsFactory,
} from '../interfaces';
import {
  DEFAULT_REDIS,
  REDIS_IO_CLIENTS,
  REDIS_IO_OPTIONS,
  REDIS_MERGED_OPTIONS,
} from '../redis.constants';
import { defaultRedisModuleOption } from './redis-default.options';
import { createClient } from './create.client';

export const createOptionsProvider = (
  options: RedisModuleOptions,
): ValueProvider<RedisModuleOptions> => ({
  provide: REDIS_IO_OPTIONS,
  useValue: options,
});

export const createAsyncOptions = async (
  optionFactory: RedisOptionsFactory,
): Promise<RedisModuleOptions> => {
  return await optionFactory.createRedisOptions();
};

export const createAsyncOptionsProvider = (
  options: RedisModuleAsyncOptions,
): Provider => {
  if (options.useFactory) {
    return {
      provide: REDIS_IO_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  if (options.useClass) {
    return {
      provide: REDIS_IO_OPTIONS,
      useFactory: createAsyncProviders,
      inject: [options.useClass],
    };
  }

  if (options.useExisting) {
    return {
      provide: REDIS_IO_OPTIONS,
      useFactory: createAsyncOptions,
      inject: [options.useExisting],
    };
  }

  return {
    provide: REDIS_IO_OPTIONS,
    useValue: {},
  };
};

export const createAsyncProviders = (
  options: RedisModuleAsyncOptions,
): Provider[] => {
  if (options.useClass) {
    return [
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      createAsyncOptionsProvider(options),
    ];
  }

  return [];
};

export const redisClientsProvider: FactoryProvider<RedisClients> = {
  provide: REDIS_IO_CLIENTS,
  useFactory: (options: RedisModuleOptions) => {
    const clients: RedisClients = new Map();
    if (Array.isArray(options?.config)) {
      options.config.forEach((item) => {
        clients.set(
          item.namespace ?? DEFAULT_REDIS,
          createClient(
            { ...options.commonOptions, ...item },
            { readyLog: options.readyLog, errorLog: options.errorLog },
          ),
        );
      });
    } else if (options.config) {
      clients.set(
        options.config.namespace ?? DEFAULT_REDIS,
        createClient(options.config, {
          readyLog: options.readyLog,
          errorLog: options.errorLog,
        }),
      );
    }

    return clients;
  },
  inject: [REDIS_MERGED_OPTIONS],
};

export const mergedOptionsProvider: FactoryProvider<RedisModuleOptions> = {
  provide: REDIS_MERGED_OPTIONS,
  useFactory: (options: RedisModuleOptions) => ({
    ...defaultRedisModuleOption,
    ...options,
  }),
  inject: [REDIS_IO_OPTIONS],
};
