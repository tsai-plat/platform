import { SetStatusData, SortnoMoveEnum } from '@tsailab/core-types';
import { AddOrganizationModel, OrganizationService, UpdateOrganizationModel } from '@tsailab/system';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    treeList(rootId: number): Promise<import("@tsailab/system").OrganizationTreeNode[]>;
    getOrganization(id: number): Promise<import("@tsailab/system").OrganizationEntity>;
    updateOrganizationStatus(dto: SetStatusData): Promise<import("@tsailab/core-types").StatusEnum>;
    updateOrganizationById(dto: UpdateOrganizationModel): Promise<Partial<import("@tsailab/system").OrganizationEntity>>;
    moveOrganizationSortno(id: number, moveType: SortnoMoveEnum): Promise<boolean>;
    addOrganizationInfo(dto: AddOrganizationModel): Promise<import("@tsailab/system").OrganizationEntity>;
    getLevelTreeList(pid?: number): Promise<import("@tsailab/system").OrganizationTreeNode[]>;
    getSelectionNodes(pid: number): Promise<import("@tsailab/core-types").TreeNodeOptionType[]>;
}
