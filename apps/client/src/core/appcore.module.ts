import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttachmentEntity,
  AttachmentService,
  CosService,
  NextNoCacheManager,
} from '@tsai-platform/core';
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import { IORedisModuleOptions, IORedisMQModule } from '@tsailab/ioredis-mq';
import { UserEntity, UserService } from '@tsailab/system';
import { ClientlogProducer } from './mq/clientlog.producer';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AttachmentEntity, UserEntity]),
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
  providers: [
    AttachmentService,
    CosService,
    ClientlogProducer,
    NextNoCacheManager,
    UserService,
  ],
  exports: [
    AttachmentService,
    CosService,
    ClientlogProducer,
    NextNoCacheManager,
    UserService,
  ],
})
export class AppcoreModule {}
