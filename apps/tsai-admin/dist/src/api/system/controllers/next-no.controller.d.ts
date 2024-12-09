import { NextNoManager } from '../services';
export declare class NextNoController {
    private readonly manager;
    constructor(manager: NextNoManager);
    initNextBatch(size: number): Promise<{
        currentMaxNo: number;
        size: number;
        biztype: number;
    }>;
    getNextno(biztype: number): Promise<{
        nextno: number;
        unoInfo: import("@tsailab/common").UsernoInfo;
    }>;
}
