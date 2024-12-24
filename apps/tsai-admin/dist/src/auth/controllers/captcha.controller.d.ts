import { ConfigService } from '@nestjs/config';
import { CaptchaService } from '@tsai-platform/core';
import { Response } from 'express';
export declare class CaptchaController {
    private readonly captchaService;
    private readonly config;
    private logger;
    constructor(captchaService: CaptchaService, config: ConfigService);
    get(nonce: string, res: Response): Promise<void>;
    private setCaptchaCookie;
}
