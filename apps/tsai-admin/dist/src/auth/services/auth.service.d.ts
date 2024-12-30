import { Logger } from '@nestjs/common';
import { SigninLocalDto } from '../dtos';
import { AuthHelper } from './auth.helper';
import { SysUserService } from '@tsailab/system';
import { IUser } from '@tsailab/core-types';
export declare class AuthService {
    private readonly authHelper;
    private readonly sysUserService;
    protected logger: Logger;
    constructor(authHelper: AuthHelper, sysUserService: SysUserService);
    login(dto: SigninLocalDto): Promise<{
        token: string;
        userinfo: IUser;
    }>;
}
