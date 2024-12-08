import { OnModuleDestroy } from '@nestjs/common';

import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export declare class IRedisService implements OnModuleDestroy {
  private readonly redis;
  constructor(redis: RedisClient);
  onModuleDestroy(): void;

  ping(): Promise<string>;
  get redisClient(): RedisClient;

  setValue<T = string | number | boolean>(key: string, value: T): Promise<T>;
  getValue<T = string | number | boolean | undefined>(key: string): Promise<T>;
  setValueEx<T = string | number | boolean>(
    key: string,
    value: T,
    ex?: number,
  ): Promise<T>;

  deleteKey(key: string): Promise<boolean>;

  findPattenKeys<T = string | number | boolean | object>(
    pattern: string,
  ): Promise<Array<T>>;

  setData<T = object>(key: string, value: T, ex?: number): Promise<T>;
  getData<T = any>(key: string): Promise<T>;
  hasKey(key: string): Promise<boolean>;
  getExpiredSeconds(key: string): Promise<number>;
  setExpires(key: string, ex: number): Promise<boolean>;
  delayUpdateData<T = Record<string, any>>(
    key: string,
    data: T,
    ex?: number,
  ): Promise<T>;

  updateSomeData<T = Record<string, any>>(
    key: string,
    data: T,
  ): Promise<Record<string, any>>;
}
