import { UserService } from '@tsai-platform/ucenter';
export declare class CustomUserService {
    private readonly userService;
    constructor(userService: UserService);
    getCustomUserByUno(userno: string): Promise<import("@tsai-platform/ucenter/dist/entities").UserEntity>;
}
