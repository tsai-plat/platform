import { Module } from '@nestjs/common';
import { CustomUserService } from './services/custom-user.service';
import { CustomUserController } from './controllers/custom-user.controller';

@Module({
  imports: [],
  controllers: [CustomUserController],
  providers: [CustomUserService],
})
export class SysAdminModule {}
