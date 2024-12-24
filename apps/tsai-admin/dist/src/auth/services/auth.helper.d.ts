import { ConfigService } from '@nestjs/config';
import { AccountType, IUser, TokenUserCache } from '@tsailab/common';
import { RedisService } from '@tsailab/ioredis-mq';
import { JwtService } from '@nestjs/jwt';
export declare class AuthHelper {
    private readonly config;
    private readonly redis;
    private readonly jwt;
    private readonly jwtOptions;
    constructor(config: ConfigService, redis: RedisService, jwt: JwtService);
    createAccessToken(user: IUser, state?: string): Promise<string>;
    private get encrptRounds();
    checkTokenExists(id: number, clit?: string, acctype?: AccountType): Promise<TokenUserCache | never>;
    renewToken(token: string): Promise<IUser | never>;
    encryptPassword(password: string): Promise<string>;
    private buildAccessPayload;
    getTokenKey(id: number, clit?: string, acctype?: AccountType): string;
    private decryptToken;
    private get expireinSeconds();
}
