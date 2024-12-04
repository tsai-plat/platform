import { Module } from '@nestjs/common';
import { CustomUserController } from './controllers/custom-user.controller';
import { CustomUserService } from './services/custom-user.service';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'sys',
        module: AdminModule,
      },
    ]),
  ],
  controllers: [CustomUserController],
  providers: [CustomUserService],
})
export class AdminModule {}
