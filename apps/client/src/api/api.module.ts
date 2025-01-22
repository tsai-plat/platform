import { Module } from '@nestjs/common';
import { CustomModule } from './custom/custom.module';
import { CommModule } from './comm/comm.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'comm',
        module: CommModule,
      },
    ]),
    CustomModule, CommModule
  ],
  controllers: [],
})
export class ApiModule {}
