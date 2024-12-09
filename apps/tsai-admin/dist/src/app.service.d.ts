import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@tsai-platform/ucenter';
export declare class AppService {
    private readonly config;
    private readonly userService;
    protected logger: Logger;
    constructor(config: ConfigService, userService: UserService);
    health(): string;
}
