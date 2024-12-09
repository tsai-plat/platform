import { SysUserService } from '@tsailab/system';
import { QueryAdminUserReqDto } from '../dtos';
import { UserService } from '@tsai-platform/ucenter';
import { Logger } from '@nestjs/common';
import { CreateSUserModel } from '@tsailab/system/dist/models/suser.model';
import { ConfigService } from '@nestjs/config';
export declare class SysUserManager {
    private readonly sysUserService;
    private readonly userService;
    private readonly config;
    protected logger: Logger;
    constructor(sysUserService: SysUserService, userService: UserService, config: ConfigService);
    queryList(dto: QueryAdminUserReqDto, filterDeleted?: boolean): Promise<{
        filterDeleted: boolean;
        r: import("@tsai-platform/ucenter/dist/entities").UserEntity;
        username?: string;
        mobile?: string;
        pageSize?: number;
        page?: number;
        keywords?: string;
    }>;
    createSystemUser(dto: CreateSUserModel): Promise<import("@tsailab/system").SystemUserEntity>;
}
