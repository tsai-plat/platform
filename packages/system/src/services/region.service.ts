import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemRegionEntity } from '../entities';
import { Repository } from 'typeorm';
import { PageEnum, StatusEnum, TreeNodeOptionType } from '@tsailab/core-types';
import { QuerySubRegionOptionModel } from '../models';
import { RegionModelType } from '../types/system.model';
import {
  BizException,
  ErrorCodeEnum,
  UpdateSortnoModel,
  UpdateStatusModel,
} from '@tsailab/common';

const SORTNO_ORDERBY = 'ASC';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(SystemRegionEntity)
    private readonly regionRepository: Repository<SystemRegionEntity>,
  ) {}

  get repository(): Repository<SystemRegionEntity> {
    return this.regionRepository;
  }

  async querySubList(queryDto: QuerySubRegionOptionModel) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      pid,
      keywords,
    } = queryDto;

    let qb = this.regionRepository
      .createQueryBuilder('region')
      .where('region.pid = :pid', { pid });
    if (keywords?.length) {
      qb = qb.andWhere(
        'region.name LIKE :name OR region.code LIKE :code OR region.value LIKE :value',
      );
    }

    const [data, total] = await qb
      .orderBy('sortno', SORTNO_ORDERBY)
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: data?.length
        ? data.map((d) => RegionService.entity2RegionModel(d))
        : [],
    };
  }

  async levelRegionTreeNodes(pid = 0) {
    const entities = await this.regionRepository
      .createQueryBuilder('region')
      .where({ pid })
      .orderBy('sortno', SORTNO_ORDERBY)
      .getMany();

    if (!entities?.length) return [];
    const pids = entities.map(({ id }) => id);

    const nodes = entities.map((entity) =>
      RegionService.entity2TreeNode(entity),
    );

    const counts = await this.regionRepository
      .createQueryBuilder('region')
      .select('region.pid', 'pid')
      .addSelect('COUNT(region.pid)', 'cnt')
      .andWhere('region.pid IN (:pids)', { pids })
      .groupBy('pid')
      .getRawMany();

    if (counts?.length) {
      counts.forEach(({ pid, cnt }) => {
        const findIdx = nodes.findIndex(
          (it) =>
            it.extra?.id === Number(pid) || Number(it.key) === Number(pid),
        );
        if (findIdx >= 0) {
          nodes.splice(findIdx, 1, {
            ...nodes[findIdx],
            isLeaf: Number(cnt) <= 0 || !cnt,
          });
        }
      });
    }

    return nodes;
  }

  async loadAllNodes(rootid = 0) {
    const roots = await this.getChildrenEntities(rootid);

    if (roots.length) {
      for (let i = 0; i < roots.length; i++) {
        roots[i] = await this.recursionTreeNodes(roots[i]);
      }
    }

    return roots;
  }

  async recursionTreeNodes(node: TreeNodeOptionType) {
    const { id } = node;

    const subs = await this.getChildrenEntities(id);
    node.isLeaf = subs.length <= 0;
    if (subs.length) {
      for (let j = 0; j < subs.length; j++) {
        await this.recursionTreeNodes(subs[j]);
      }

      node.children = subs;
    }

    return node;
  }

  async getRegionModel(id: number): Promise<RegionModelType | never> {
    const entity = await this.regionRepository.findOneBy({ id });
    if (entity) return RegionService.entity2RegionModel(entity);
  }

  getRegionEntity(id: number) {
    return this.regionRepository.findOneBy({ id });
  }

  async updateRegionSome(some: Partial<RegionModelType>) {
    const { id, name, code, value, tag, remark, extra, status, sortno } = some;
    const entity = await this.getRegionEntity(id);
    if (!entity)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `该行政区划不存在,请刷新后再试!`,
      );

    let extraJson = entity.extra;
    if (extra) {
      try {
        extraJson = JSON.stringify(extra);
      } catch (_e) {}
    }

    const updated: Partial<SystemRegionEntity> = {
      ...entity,
      name,
      code,
      value,
      tag,
      remark,
      sortno: sortno ?? entity.sortno,
      status: status,
      extra: extraJson,
      id: entity.id,
    };

    const saved = await this.regionRepository.save(updated);
    return RegionService.entity2RegionModel(saved);
  }

  async getChildrenEntities(pid: number): Promise<Array<TreeNodeOptionType>> {
    const entities = await this.regionRepository
      .createQueryBuilder('region')
      .where({ pid })
      .orderBy('sortno', SORTNO_ORDERBY)
      .getMany();

    return entities?.length
      ? entities.map((entity) => RegionService.entity2TreeNode(entity))
      : [];
  }

  async updateSortno(dto: UpdateSortnoModel) {
    const { id, sortno } = dto;
    if (!id)
      throw BizException.createError(
        ErrorCodeEnum.ILLEGAL_ARGS,
        `Miss parameter ID.`,
      );

    const { affected } = await this.regionRepository
      .createQueryBuilder('region')
      .update(SystemRegionEntity)
      .set({ sortno })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async updateStatus(dto: UpdateStatusModel) {
    const { id, status } = dto;
    if (!id)
      throw BizException.createError(
        ErrorCodeEnum.ILLEGAL_ARGS,
        `Miss parameter ID.`,
      );

    const { affected } = await this.regionRepository
      .createQueryBuilder('region')
      .update(SystemRegionEntity)
      .set({ status: status })
      .where({ id })
      .execute();

    return affected > 0;
  }

  static entity2RegionModel(entity: SystemRegionEntity) {
    const {
      id,
      pid,
      name,
      code,
      value,
      tag,
      status = StatusEnum.NORMAL,
      sortno = 0,
      remark,
      extra,
    } = entity;

    let extraObj: Record<string, any> | undefined;

    if (extra?.length) {
      try {
        extraObj = JSON.parse(
          extra
            .split(/\n/)
            .map((v) => v.trim())
            .join(''),
        );
      } catch (_e) {}
    }

    return {
      id,
      pid: Number(pid),
      name,
      code,
      value,
      tag,
      remark,
      sortno: sortno,
      status,
      extra: extraObj,
    } as any as RegionModelType;
  }

  static entity2TreeNode(entity: SystemRegionEntity): TreeNodeOptionType {
    const { id, pid, name, code, value, extra, status, sortno } = entity;

    let extraObj: Record<string, any>;
    try {
      extraObj = extra?.length
        ? {
            ...JSON.parse(
              extra
                .split(/\n/)
                .map((v) => v.trim())
                .join(''),
            ),
            id,
            code,
            value,
            sortno,
          }
        : {
            id,
            code,
            value,
            sortno,
          };
    } catch (_e) {}

    return {
      id,
      key: id,
      label: name,
      pid: Number(pid),
      disabled: status === StatusEnum.FORBIDDEN,
      extra: extraObj,
    } as TreeNodeOptionType;
  }
}
