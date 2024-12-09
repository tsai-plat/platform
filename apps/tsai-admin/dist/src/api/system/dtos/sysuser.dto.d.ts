import { QueryOptionsDto } from '@tsailab/common';
export declare class QueryAdminUserReqDto extends QueryOptionsDto {
    username?: string;
    mobile?: string;
}
export declare class QueryAccountSelectionParams {
    orgid?: number;
    useStatusCtrl?: boolean;
}
