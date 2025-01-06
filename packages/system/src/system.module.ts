import { DynamicModule, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NextNoEntity,
  OrganizationEntity,
  RoleEntity,
  SysDictEntity,
  SysDictItemEntity,
  SystemRegionEntity,
  SystemUserEntity,
  UserEntity,
} from './entities';
import {
  DictService,
  NextNoService,
  SystemConfigService,
  SysUserService,
  UserService,
} from './services';
import { RegionService } from './services/region.service';
import { OrganizationService } from './services/organization.service';
import { RoleService } from './services/role.service';

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
          SystemRegionEntity,
          OrganizationEntity,
          RoleEntity,
          UserEntity,
        ]),
      ],
      providers: [
        DictService,
        NextNoService,
        SystemConfigService,
        SysUserService,
        RegionService,
        OrganizationService,
        RoleService,
        UserService,
      ],
      exports: [
        DictService,
        NextNoService,
        SystemConfigService,
        SysUserService,
        RegionService,
        OrganizationService,
        RoleService,
        UserService,
      ],
    };
  }
}
