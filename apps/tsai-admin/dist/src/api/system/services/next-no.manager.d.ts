import { ConfigService } from '@nestjs/config';
import { NextNoService } from '@tsailab/system';
export declare class NextNoManager {
    private readonly config;
    private readonly nextnoService;
    private seeds;
    constructor(config: ConfigService, nextnoService: NextNoService);
    batchInitNextnos(size: number, biztype: number, locked?: boolean): Promise<{
        currentMaxNo: number;
        size: number;
        biztype: number;
    }>;
    getNextno(biztype: number): Promise<{
        nextno: number;
        unoInfo: import("@tsailab/common").UsernoInfo;
    }>;
}
