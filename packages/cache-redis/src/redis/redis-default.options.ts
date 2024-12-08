import { RedisModuleOptions } from '../interfaces';

export const defaultRedisModuleOption: RedisModuleOptions = {
  colseClient: true,
  commonOptions: undefined,
  readyLog: true,
  errorLog: true,
  config: {},
};
