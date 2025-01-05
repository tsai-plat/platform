import { DictManagerService } from './dict-manager.service';
import { DictItemDefaultActivedModel, DictService, QueryDictItemModel, SysDictBaseModel, SysDictItemBaseModel, SysDictItemModel, SysDictModel } from '@tsailab/system';
import { QueryOptionsDto, UpdateSortnoModel, UpdateStatusModel } from '@tsailab/common';
export declare class DictController {
    private readonly manager;
    private readonly dictService;
    constructor(manager: DictManagerService, dictService: DictService);
    listDict(queryDto: QueryOptionsDto): Promise<{
        page: number;
        pageSize: number;
        total: number;
        list: import("@tsailab/system").SysDictEntity[];
    }>;
    createDictInfo(dict: SysDictBaseModel): Promise<import("@tsailab/system").SysDictEntity>;
    updateDictInfo(dict: SysDictModel): Promise<{
        id: number;
        name: string;
        code: string;
        tag: string;
        icon: string;
        remark: string;
        sortno: number;
        status: import("@tsailab/core-types").StatusEnum;
        items: Array<import("@tsailab/system").SysDictItemEntity>;
        orgid?: number;
        createdBy?: number;
        updatedBy?: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
    } & import("@tsailab/system").SysDictEntity>;
    listDictItems(queryDto: QueryDictItemModel): Promise<{
        page: number;
        pageSize: number;
        total: number;
        list: import("@tsailab/system").SysDictItemEntity[];
    }>;
    setSortnoById(dto: UpdateSortnoModel): Promise<number>;
    createDictItem(dto: SysDictItemBaseModel): Promise<import("@tsailab/system").SysDictItemEntity>;
    updateDictItemSome(dto: SysDictItemModel): Promise<{
        extra: any;
        id: number;
        dictId: number;
        label: string;
        value: string;
        icon: string;
        remark: string;
        sortno: number;
        status: import("@tsailab/core-types").StatusEnum;
        defaultActived: boolean;
        orgid?: number;
        createdBy?: number;
        updatedBy?: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
    }>;
    setItemSortnoById(dto: UpdateSortnoModel): Promise<boolean>;
    setDictItemStatus(dto: UpdateStatusModel): Promise<boolean>;
    setDictItemActivedStatus(dto: DictItemDefaultActivedModel): Promise<boolean>;
    getDictItemSelections(dictCode: string): Promise<import("@tsailab/core-types").SelectorOptionsType<string>[]>;
}
