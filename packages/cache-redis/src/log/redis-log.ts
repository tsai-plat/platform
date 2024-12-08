import { Logger } from '@nestjs/common';
import { REDIS_MODULE_ID } from '../redis.constants';

export const redisLogger = new Logger(REDIS_MODULE_ID, { timestamp: true });
