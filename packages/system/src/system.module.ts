import { DynamicModule, Module } from '@nestjs/common';
import { DictService, SystemService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDictEntity, SysDictItemEntity } from './entities';

@Module({})
export class SystemModule {
  static async forRoot(isGlobal: boolean = true): Promise<DynamicModule> {
    return {
      module: SystemModule,
      global: isGlobal,
      imports: [TypeOrmModule.forFeature([SysDictEntity, SysDictItemEntity])],
      providers: [DictService, SystemService],
      exports: [DictService, SystemService],
    };
  }
}
