import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NextNoCacheManager } from '@tsai-platform/core';
import { NextNoType } from '@tsailab/core-types';
import { OrganizationService, SysUserService } from '@tsailab/system';

@Injectable()
export class SystemInitService implements OnModuleInit {
  private readonly logger = new Logger(SystemInitService.name);
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly sysUserService: SysUserService,
    private readonly nextnoCacheManager: NextNoCacheManager,
  ) {}
  onModuleInit() {
    this.initRootOrganization();
    this.initUserNos();
    this.initSupperAdminUser();
  }

  private async initRootOrganization() {
    try {
      await this.organizationService.initRootNode();
      this.logger.log('Initialize root organization success');
    } catch (e) {
      this.logger.error(`Initialize root organization error,${e.message}`);
    }
  }

  private async initUserNos() {
    try {
      const msg = await this.nextnoCacheManager.increaseUnos(NextNoType.USER);
      // const nextno = await this.nextnoCacheManager.getNextno(
      //   NextNoBiztype.USER,
      // );
      // await this.nextnoCacheManager.setHash(NextNoBiztype.USER, nextno);
      // this.logger.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ${nextno}`);
      this.logger.log(`Initialize user no success: ${msg}`);
    } catch (e) {
      this.logger.error(`Initialize user no error,${e.message}`);
    }
  }

  private async initSupperAdminUser() {
    try {
      const result = await this.sysUserService.initSuperUser();
      this.logger.log(result);
    } catch (e) {
      this.logger.error(`Initialize root organization error,${e.message}`);
    }
  }
}
