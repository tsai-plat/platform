import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import {
  ApiTransformInterceptor,
  isProdRuntime,
  MysqlConfigFactory,
} from '@tsai-platform/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { AppCoreModule } from './appcore/app-core.module';
import { SystemModule } from '@tsailab/system';
import { yamlConfigLoader } from '@tsailab/ioredis-mq';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: isProdRuntime(),
      isGlobal: true,
      load: [yamlConfigLoader],
      validationOptions: {
        allowUnknow: true,
        abortEarly: true,
      },
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
