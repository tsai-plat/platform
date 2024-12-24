import { ConfigService } from '@nestjs/config';
import { RedisService } from '@tsailab/ioredis-mq';
import { JwtService } from '@nestjs/jwt';
export declare class AuthHelper {
    private readonly config;
    private readonly redis;
    private readonly jwt;
    private readonly jwtOptions;
    constructor(config: ConfigService, redis: RedisService, jwt: JwtService);
}
