import { DynamicModule, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NextNoEntity,
  SysDictEntity,
  SysDictItemEntity,
  SystemUserEntity,
} from './entities';
import {
  DictService,
  NextNoService,
  SystemConfigService,
  SysUserService,
} from './services/expose.services';

@Module({
  providers: [],
  exports: [],
})
export class SystemModule {
  static async forRoot(isGlobal: boolean = true): Promise<DynamicModule> {
    return {
      module: SystemModule,
      global: isGlobal,
      imports: [
        TypeOrmModule.forFeature([
          NextNoEntity,
          SysDictEntity,
          SysDictItemEntity,
          SystemUserEntity,
        ]),
      ],
      providers: [
        DictService,
        NextNoService,
        SystemConfigService,
        SysUserService,
      ],
      exports: [
        DictService,
        NextNoService,
        SystemConfigService,
        SysUserService,
      ],
    };
  }
}
