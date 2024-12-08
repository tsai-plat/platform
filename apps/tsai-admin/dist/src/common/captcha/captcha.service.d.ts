import { NodeRedisService } from '@tsailab/node-redis';
export declare class CaptchaService {
    private readonly redisSevice;
    protected readonly expires: number;
    constructor(redisSevice: NodeRedisService);
    getCaptchaMath(nonce: string): Promise<string>;
    private captchaMath;
}
