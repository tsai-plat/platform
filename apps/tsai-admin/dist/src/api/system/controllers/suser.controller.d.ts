import { SysUserManager } from '../services';
import { QueryAdminUserReqDto, ResetSysUserPwdDto } from '../dtos';
import { UpdateUserStatusModel } from '@tsailab/common';
import { IUser } from '@tsailab/core-types';
import { CreateSUserModel, UpdateSUserModel } from '@tsailab/system';
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
    updateSystemUser(dto: UpdateSUserModel): Promise<boolean>;
    resetOtherPassword(dto: ResetSysUserPwdDto, user: IUser): Promise<boolean>;
    updateStatus(dto: UpdateUserStatusModel, user: IUser): Promise<boolean>;
    setIsSuper(id: number, user: IUser): Promise<boolean>;
    cancelIsSuper(id: number, user: IUser): Promise<boolean>;
}
