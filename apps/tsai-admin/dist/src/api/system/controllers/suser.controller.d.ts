import { SysUserManager } from '../services';
import { QueryAdminUserReqDto } from '../dtos';
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
}
