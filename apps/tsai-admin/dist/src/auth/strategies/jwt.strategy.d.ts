import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { IUser, JwtAccessPayload } from '@tsailab/common';
import { AuthHelper } from '../services/auth.helper';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    private readonly authHelper;
    protected logger: Logger;
    constructor(config: ConfigService, authHelper: AuthHelper);
    validate(payload: JwtAccessPayload): Promise<IUser>;
}
export {};
