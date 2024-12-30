import { UpdateSortnoModel, UpdateStatusModel } from '@tsailab/common';
import { QuerySubRegionOptionModel, RegionModelType, RegionService } from '@tsailab/system';
export declare class RegionController {
    private readonly regionService;
    constructor(regionService: RegionService);
    getAllRegionTreeNodes(rootid: number): Promise<import("@tsailab/core-types").TreeNodeOptionType[]>;
    getRegionTreeNodeAsync(rootid: number): Promise<import("@tsailab/core-types").TreeNodeOptionType[]>;
    getRegionModelDetail(id: number): Promise<RegionModelType>;
    updateRegionModelSome(some: Partial<RegionModelType>): Promise<RegionModelType>;
    setRegionSortno(dto: UpdateSortnoModel): Promise<boolean>;
    setRegionStatus(dto: UpdateStatusModel): Promise<boolean>;
    querySubListRegions(queryDto: QuerySubRegionOptionModel): Promise<{
        page: number;
        pageSize: number;
        total: number;
        list: RegionModelType[];
    }>;
}
