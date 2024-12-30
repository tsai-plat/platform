import { SysUserManager } from '../services';
import { QueryAdminUserReqDto, ResetSysUserPwdDto } from '../dtos';
import { CreateSUserModel } from '@tsailab/system/dist/models/suser.model';
import { UpdateUserStatusModel } from '@tsailab/common';
import { IUser } from '@tsailab/core-types';
export declare class SuserController {
    private readonly sysManager;
    constructor(sysManager: SysUserManager);
    list(queryDto: QueryAdminUserReqDto): Promise<{
        page: number;
        pageSize: number;
        total: number;
        list: import("@tsailab/system").SystemUserEntity[];
    }>;
    addSystemUser(user: CreateSUserModel): Promise<import("@tsailab/system").SystemUserEntity>;
    resetOtherPassword(dto: ResetSysUserPwdDto, user: IUser): Promise<boolean>;
    updateStatus(dto: UpdateUserStatusModel, user: IUser): Promise<import("typeorm").UpdateResult>;
}
