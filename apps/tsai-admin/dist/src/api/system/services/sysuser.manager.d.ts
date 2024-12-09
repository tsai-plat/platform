import { SysUserService } from '@tsailab/system';
import { QueryAdminUserReqDto } from '../dtos';
import { UserService } from '@tsai-platform/ucenter';
import { Logger } from '@nestjs/common';
export declare class SysUserManager {
    private readonly sysUserService;
    private readonly userService;
    protected logger: Logger;
    constructor(sysUserService: SysUserService, userService: UserService);
    queryList(dto: QueryAdminUserReqDto, filterDeleted?: boolean): Promise<{
        filterDeleted: boolean;
        r: import("@tsai-platform/ucenter/dist/entities").UserEntity;
        username?: string;
        mobile?: string;
        pageSize?: number;
        page?: number;
        keywords?: string;
    }>;
}
