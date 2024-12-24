import { Logger } from '@nestjs/common';
import { SigninLocalDto } from '../dtos';
import { Request } from 'express';
import { CaptchaService } from '@tsai-platform/core';
export declare class AuthController {
    private readonly captcha;
    protected logger: Logger;
    constructor(captcha: CaptchaService);
    login(req: Request, dto: SigninLocalDto): Promise<{
        account: string;
        password: string;
        code?: string;
        isLock?: boolean;
        cookieValue?: string;
    }>;
}
