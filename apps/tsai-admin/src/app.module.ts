import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ApiTransformInterceptor,
  isProdRuntime,
  MysqlConfigFactory,
  YamlConfigLoader,
} from '@tsai-platform/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { AppCoreModule } from './appcore/app-core.module';
import { SystemModule } from '@tsailab/system';
import { IORedisModuleOptions, IORedisMQModule } from '@tsailab/ioredis-mq';
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: isProdRuntime(),
      isGlobal: true,
      load: [YamlConfigLoader],
      validationOptions: {
        allowUnknow: true,
        abortEarly: true,
      },
    }),
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
    TypeOrmModule.forRootAsync({
      useClass: MysqlConfigFactory,
    }),
    SystemModule.forRoot(true),
    AppCoreModule,
    ApiModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiTransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {}
}
