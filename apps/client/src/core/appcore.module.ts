import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextNoCacheManager } from '@tsai-platform/core';
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import { IORedisModuleOptions, IORedisMQModule } from '@tsailab/ioredis-mq';
import { UserEntity, UserService } from '@tsailab/system';
import { ClientlogProducer } from './mq/clientlog.producer';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    IORedisMQModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const ioredisOpts = config.get('cache.ioredis');
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
  providers: [UserService, ClientlogProducer, NextNoCacheManager],
  exports: [UserService, ClientlogProducer, ClientlogProducer],
})
export class AppcoreModule {}
