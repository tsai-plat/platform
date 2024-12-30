import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthHelper } from '../services/auth.helper';
import { JwtAccessPayload } from '@tsailab/core-types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    private readonly authHelper;
    protected logger: Logger;
    private readonly singleton;
    constructor(config: ConfigService, authHelper: AuthHelper);
    validate(payload: JwtAccessPayload, done: VerifiedCallback): Promise<void>;
}
export {};
