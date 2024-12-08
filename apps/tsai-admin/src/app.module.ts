import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import {
  ApiTransformInterceptor,
  isProdRuntime,
  MysqlConfigFactory,
  YamlConfigLoader,
} from '@tsai-platform/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UcenterModule } from '@tsai-platform/ucenter';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { NodeRedisModule } from '@tsailab/node-redis';
import { SystemModule } from '@tsailab/system';

import { CommModule } from './common/comm.module';
import { ApiModule } from './api/api.module';

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
    NodeRedisModule.forRoot({
      config: {
        host: '172.20.0.1',
        port: 6379,
        db: 8,
        ttl: 5,
        password: 'admin123',
      },
    }),
    TypeOrmModule.forRootAsync({
      useClass: MysqlConfigFactory,
    }),
    SystemModule.forRoot(),
    UcenterModule.forRoot({ isGlobal: true }),
    CommModule,
    ApiModule,
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
