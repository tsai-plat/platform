import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { AdminModule } from './system/admin/admin.module';
// import { AppGlobalModule } from './app-global/app-global.module';
import { ConfigModule } from '@nestjs/config';
import { isProdRuntime, MysqlConfigFactory, YamlConfigLoader } from '@tsai-platform/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UcenterModule } from '@tsai-platform/ucenter';
import { AdminModule } from './system/admin/admin.module';

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
    TypeOrmModule.forRootAsync({
      useClass:MysqlConfigFactory
    }),
    UcenterModule.forRoot({isGlobal:true}),
    AdminModule,
    // AppGlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
