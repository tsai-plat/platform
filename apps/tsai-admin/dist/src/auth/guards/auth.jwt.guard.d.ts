import { ExecutionContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
declare const AuthJwtGuard_base: import("@nestjs/passport").Type<IAuthGuard>;
export declare class AuthJwtGuard extends AuthJwtGuard_base implements IAuthGuard {
    private reflector;
    private readonly config;
    protected logger: Logger;
    constructor(reflector: Reflector, config: ConfigService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private extractTokenFromHeader;
}
export {};
