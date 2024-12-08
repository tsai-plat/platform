import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { MysqlDBConfigSchema } from '@tsailab/common/types';

@Injectable()
export class MysqlConfigFactory implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  createTypeOrmOptions(
    _connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const dbOptions = this.configService.get('mysql');

    if (!dbOptions) {
      throw new Error('unfoud mysql config.');
    }

    const {
      host = '127.0.0.1',
      port = 3306,
      database,
      username,
      password,
      logging = false,
      synchronize = true,
      autoLoadEntities = true,
    } = dbOptions as any as MysqlDBConfigSchema;
    if (!database?.length || !username?.length || !password?.length) {
      throw new Error(`Mysql config key database,username or password unset.`);
    }

    const options: TypeOrmModuleOptions = {
      type: 'mysql',
      host,
      port,
      database,
      username,
      password,
      logging,
      synchronize,
      autoLoadEntities,
      entities: [
        process.cwd() + '/**/*.entity.{ts,js}',
        process.cwd() + '/**/*.orm.{ts,js}',
      ],
      timezone: '+08:00', // 东八区
      cache: {
        duration: 60000, // 1分钟的缓存
      },
    };

    return options;
  }
}
