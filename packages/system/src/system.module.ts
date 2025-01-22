import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientLogEntity,
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
  SystemConfigService,
  SysUserService,
  UserService,
} from './services';
import { RegionService } from './services/region.service';
import { OrganizationService } from './services/organization.service';
import { RoleService } from './services/role.service';
import { ClientLogService } from './services/client-log.service';

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
          ClientLogEntity,
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
        ClientLogService,
        DictService,
        SystemConfigService,
        SysUserService,
        RegionService,
        OrganizationService,
        RoleService,
        UserService,
      ],
      exports: [
        ClientLogService,
        DictService,
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
