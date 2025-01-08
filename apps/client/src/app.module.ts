import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppcoreModule } from './core/appcore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { yamlConfigLoader } from '@tsailab/ioredis-mq';
import {
  ApiTransformInterceptor,
  isProdRuntime,
  MysqlConfigFactory,
} from '@tsai-platform/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
      inject: [ConfigService],
    }),
    AppcoreModule,
    AuthModule,
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
export class AppModule {}
