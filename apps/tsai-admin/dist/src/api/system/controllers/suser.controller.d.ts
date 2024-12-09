import { SysUserManager } from '../services';
import { QueryAdminUserReqDto } from '../dtos';
import { CreateSUserModel } from '@tsailab/system/dist/models/suser.model';
export declare class SuserController {
    private readonly sysManager;
    constructor(sysManager: SysUserManager);
    list(queryDto: QueryAdminUserReqDto): Promise<{
        filterDeleted: boolean;
        r: import("@tsai-platform/ucenter/dist/entities").UserEntity;
        username?: string;
        mobile?: string;
        pageSize?: number;
        page?: number;
        keywords?: string;
    }>;
    addSystemUser(user: CreateSUserModel): Promise<import("@tsailab/system").SystemUserEntity>;
}
