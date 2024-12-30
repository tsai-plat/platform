import { Logger } from '@nestjs/common';
import { SigninLocalDto } from '../dtos';
import { Request } from 'express';
import { CaptchaService } from '@tsai-platform/core';
import { AuthService } from '../services/auth.service';
import { IUser } from '@tsailab/core-types';
export declare class AuthController {
    private readonly captcha;
    private readonly authService;
    protected logger: Logger;
    constructor(captcha: CaptchaService, authService: AuthService);
    login(req: Request, dto: SigninLocalDto): Promise<{
        token: string;
        userinfo: IUser;
    }>;
    getUserInfo(user: IUser): Promise<IUser>;
}
