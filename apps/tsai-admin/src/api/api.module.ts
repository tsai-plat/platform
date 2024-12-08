import { Module } from '@nestjs/common';
import { SysAdminModule } from './system/sys-admin.module';
import { RouterModule } from '@nestjs/core';
import { TsaiAdminModuleRoutes } from './api.routes';

@Module({
  imports: [
    RouterModule.register([
      {
        path: TsaiAdminModuleRoutes.systemRoute.modulePath,
        module: SysAdminModule,
      },
    ]),
    SysAdminModule,
  ],
})
export class ApiModule {}
