import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private readonly config;
    protected logger: Logger;
    constructor(config: ConfigService);
    health(): string;
}
