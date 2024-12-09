import { CaptchaService } from '@tsai-platform/core';
import { Response } from 'express';
export declare class CaptchaController {
    private readonly captchaService;
    constructor(captchaService: CaptchaService);
    get(nonce: string, res: Response): Promise<void>;
}
