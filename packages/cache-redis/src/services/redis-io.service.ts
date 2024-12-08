import { Inject, Injectable } from '@nestjs/common';
import { DEFAULT_REDIS, REDIS_IO_CLIENTS } from '../redis.constants';
import { Namespace, RedisClients } from '../interfaces';
import { RedisClientNotFoundError } from '../errors';
import { parseNamespace } from '../utils';
import type { Redis } from 'ioredis';

@Injectable()
export class RedisIOService {
  constructor(
    @Inject(REDIS_IO_CLIENTS)
    private readonly clients: RedisClients,
  ) {}

  getOrThrow(namespace: Namespace = DEFAULT_REDIS): Redis {
    const client = this.clients.get(namespace);
    if (!client) throw new RedisClientNotFoundError(parseNamespace(namespace));
    return client;
  }

  getOrNil(namespace: Namespace = DEFAULT_REDIS): Redis | null {
    const client = this.clients.get(namespace);
    if (!client) return null;
    return client;
  }
}
