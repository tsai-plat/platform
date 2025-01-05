import { OnModuleInit } from '@nestjs/common';
import { NextNoService, OrganizationService, SysUserService } from '@tsailab/system';
export declare class SystemInitService implements OnModuleInit {
    private readonly organizationService;
    private readonly nextNoService;
    private readonly sysUserService;
    private readonly logger;
    constructor(organizationService: OrganizationService, nextNoService: NextNoService, sysUserService: SysUserService);
    onModuleInit(): void;
    private initRootOrganization;
    private initUserNos;
    private initSupperAdminUser;
}
