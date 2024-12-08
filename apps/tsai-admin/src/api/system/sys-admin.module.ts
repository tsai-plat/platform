import { Module } from '@nestjs/common';
import { DictController } from './dict/dict.controller';
import { DictManagerService } from './dict/dict-manager.service';

@Module({
  controllers: [DictController],
  providers: [DictManagerService],
})
export class SysAdminModule {}
