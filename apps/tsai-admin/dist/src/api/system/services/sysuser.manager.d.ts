import { SystemConfigService, SysUserService } from '@tsailab/system';
import { QueryAdminUserReqDto, ResetSysUserPwdDto } from '../dtos';
import { Logger } from '@nestjs/common';
import { CreateSUserModel } from '@tsailab/system/dist/models/suser.model';
import { ConfigService } from '@nestjs/config';
import { UpdateUserStatusModel } from '@tsailab/common';
import { IUser } from '@tsailab/core-types';
export declare class SysUserManager {
    private readonly sysUserService;
    private readonly sysConfigService;
    private readonly config;
    protected logger: Logger;
    constructor(sysUserService: SysUserService, sysConfigService: SystemConfigService, config: ConfigService);
    queryList(dto: QueryAdminUserReqDto, filterDeleted?: boolean): Promise<{
        page: number;
        pageSize: number;
        total: number;
        list: import("@tsailab/system").SystemUserEntity[];
    }>;
    updateSystemUserStatus(dto: UpdateUserStatusModel): Promise<import("typeorm").UpdateResult>;
    resetSystemUserPassword(dto: ResetSysUserPwdDto, user: IUser): Promise<boolean>;
    createSystemUser(dto: CreateSUserModel): Promise<import("@tsailab/system").SystemUserEntity>;
}
