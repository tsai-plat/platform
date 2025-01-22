import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextNoCacheManager } from '@tsai-platform/core';
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import { IORedisModuleOptions, IORedisMQModule } from '@tsailab/ioredis-mq';
import { ClientLogConsumner } from './mq';

@Global()
@Module({
  imports: [
    IORedisMQModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const ioredisOpts = config.get('cache.ioredis');
        globalThis.console.log(ioredisOpts);
        if (!ioredisOpts)
          throw BizException.createError(
            ErrorCodeEnum.SERVICE_UNAVAILABLE,
            `IORedis configuration error.Please check yaml key [cache.ioredis]`,
          );

        return ioredisOpts as unknown as IORedisModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [NextNoCacheManager, ClientLogConsumner],
  exports: [NextNoCacheManager, ClientLogConsumner],
})
export class AppCoreModule {}
