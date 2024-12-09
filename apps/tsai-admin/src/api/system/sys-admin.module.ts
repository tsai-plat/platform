import { Module } from '@nestjs/common';
import { DictController } from './dict/dict.controller';
import { DictManagerService } from './dict/dict-manager.service';
import { SuserController } from './controllers/suser.controller';
import { NextNoManager, SysUserManager } from './services';

import { NextNoController } from './controllers/next-no.controller';

@Module({
  imports: [],
  controllers: [DictController, SuserController, NextNoController],
  providers: [DictManagerService, SysUserManager, NextNoManager],
})
export class SysAdminModule {}
