import { Module } from '@nestjs/common';
import { CustomUserController } from './controllers/custom-user.controller';
import { CustomUserService } from './services/custom-user.service';

@Module({
  imports: [],
  controllers: [CustomUserController],
  providers: [CustomUserService],
})
export class AdminModule {}
