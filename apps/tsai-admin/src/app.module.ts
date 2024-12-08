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
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { CommModule } from './common/comm.module';
import { NodeRedisModule } from '@tsailab/node-redis';

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
    UcenterModule.forRoot({ isGlobal: true }),
    RouterModule.register([
      {
        path: 'comm',
        module: CommModule,
      },
    ]),
    CommModule,
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
