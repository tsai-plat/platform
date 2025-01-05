import { Module } from '@nestjs/common';
import { DictController } from './dict/dict.controller';
import { DictManagerService } from './dict/dict-manager.service';
import { SuserController } from './controllers/suser.controller';
import { NextNoManager, SysUserManager } from './services';

import { NextNoController } from './controllers/next-no.controller';
import { RegionController } from './controllers/region.controller';
import { OrganizationController } from './controllers/organization.controller';
import { RoleController } from './controllers/role.controller';
import { SystemInitService } from './services/system-init.service';

@Module({
  imports: [],
  controllers: [DictController, SuserController, NextNoController, RegionController, OrganizationController, RoleController],
  providers: [DictManagerService, SysUserManager, NextNoManager, SystemInitService],
})
export class SysAdminModule {}
