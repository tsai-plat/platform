import { QueryPageParams, SetStatusData } from '@tsailab/core-types';
import { BaseRoleModel, CreateRoleModel, RoleService } from '@tsailab/system';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    queryList(queryParams: QueryPageParams): Promise<{
        page: number;
        pageSize: number;
        total: number;
        list: import("@tsailab/system").RoleEntity[];
    }>;
    createRole(dto: CreateRoleModel): Promise<import("@tsailab/system").RoleEntity>;
    updateRole(dto: BaseRoleModel): Promise<import("@tsailab/system").RoleEntity>;
    setDefault(id: number): Promise<boolean>;
    updateRoleStatus(data: SetStatusData): Promise<boolean>;
}
