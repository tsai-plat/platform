import type { Redis } from 'ioredis';

export type Namespace = string | symbol;
export type RedisClients = Map<Namespace, Redis>;
