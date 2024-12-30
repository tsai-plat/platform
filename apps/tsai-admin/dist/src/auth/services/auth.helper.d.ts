import { ConfigService } from '@nestjs/config';
import { RedisService } from '@tsailab/ioredis-mq';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { AccountType, IUser, JwtAccessPayload, TokenUserCache } from '@tsailab/core-types';
export declare class AuthHelper {
    private readonly config;
    private readonly redis;
    private readonly jwt;
    protected logger: Logger;
    private readonly jwtOptions;
    constructor(config: ConfigService, redis: RedisService, jwt: JwtService);
    createAccessToken(user: IUser, state?: string): Promise<string>;
    private get encrptRounds();
    checkTokenExists(id: number, clit?: string, acctype?: AccountType): Promise<TokenUserCache | never>;
    renewToken(token: string): Promise<IUser | never>;
    encryptPassword(password: string): Promise<string>;
    comparePassword(password?: string, encrypted?: string): Promise<boolean>;
    private buildAccessPayload;
    getTokenKey(id: number, clit?: string, acctype?: AccountType): string;
    decryptToken(token: string): Promise<JwtAccessPayload>;
    private get expireinSeconds();
}
