import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  NextNoService,
  OrganizationService,
  SysUserService,
} from '@tsailab/system';

@Injectable()
export class SystemInitService implements OnModuleInit {
  private readonly logger = new Logger(SystemInitService.name);
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly nextNoService: NextNoService,
    private readonly sysUserService: SysUserService,
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
      const count = await this.nextNoService.autoInitBatchNosOnModuleInit(
        1,
        1000,
      );
      this.logger.log(`Initialize user no success ${count} records`);
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
