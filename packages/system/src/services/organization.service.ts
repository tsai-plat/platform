import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import {
  SetSortnoData,
  SetStatusData,
  StatusEnum,
  TreeNodeOptionType,
} from '@tsailab/core-types';
import {
  AddOrganizationModel,
  OrganizationTreeNode,
  UpdateOrganizationModel,
} from '../models';

export const ROOT_NODE_ID = 0;

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly orgRepository: Repository<OrganizationEntity>,
  ) {}

  get repository(): Repository<OrganizationEntity> {
    return this.orgRepository;
  }

  async moveUpRecord(id: number): Promise<boolean | never> {
    const entity = await this.orgRepository.findOneBy({
      id,
    });

    if (!entity)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `组织${id}不存在`,
      );

    const currSortno = entity.sortno;

    const list = await this.orgRepository
      .createQueryBuilder('org')
      .select()
      .where('level = :level', { level: entity.level })
      .orderBy('sortno', 'ASC')
      .addOrderBy('id', 'ASC')
      .getMany();

    if (list.length < 2) {
      return true;
    }

    const index = list.findIndex((e) => e.id === id);
    if (index < 1) {
      return true;
    }

    const previous = list[index - 1];

    // swap sortno
    if (previous.sortno === entity.sortno) {
      entity.sortno = currSortno - 1 >= 0 ? currSortno - 1 : 0;
    } else {
      entity.sortno = previous.sortno;
      previous.sortno = currSortno;
    }

    await this.orgRepository
      .createQueryBuilder()
      .update(entity)
      .set({ sortno: entity.sortno })
      .where('id = :id', { id: id })
      .execute();

    await this.orgRepository
      .createQueryBuilder()
      .update(previous)
      .set({ sortno: currSortno })
      .where('id = :id', { id: previous.id })
      .execute();

    return true;
  }

  async moveDownRecord(id: number): Promise<boolean | never> {
    const entity = await this.orgRepository.findOneBy({
      id,
    });

    if (!entity)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `组织${id}不存在`,
      );

    const nextNo = entity.sortno + 1;

    const list = await this.orgRepository
      .createQueryBuilder('org')
      .select()
      .where('level = :level', { level: entity.level })
      .orderBy('sortno', 'ASC')
      .addOrderBy('id', 'ASC')
      .getMany();

    if (list.length < 2) {
      return true;
    }

    const index = list.findIndex((e) => e.id === id);
    if (index === list.length - 1) {
      return true;
    }

    const next = list[index + 1];
    if (next.sortno === entity.sortno) {
      entity.sortno = nextNo;
    } else {
      entity.sortno = next.sortno;
      next.sortno = entity.sortno;
    }

    await this.orgRepository
      .createQueryBuilder()
      .update(entity)
      .set({ sortno: entity.sortno })
      .where('id = :id', { id: id })
      .execute();

    await this.orgRepository
      .createQueryBuilder()
      .update(next)
      .set({ sortno: next.sortno })
      .where('id = :id', { id: next.id })
      .execute();

    return true;
  }

  async updateSortno(dto: SetSortnoData): Promise<boolean | never> {
    const { id, sortno } = dto;
    const entity = await this.orgRepository.findOneBy({
      id,
    });

    if (!entity)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `组织${id}不存在`,
      );

    if (entity.sortno === sortno) {
      return true;
    }

    await this.orgRepository
      .createQueryBuilder()
      .update(entity)
      .set({ sortno: sortno })
      .where('id = :id', { id })
      .execute();
    return true;
  }

  getById(id: number): Promise<OrganizationEntity | never> {
    return this.orgRepository.findOneBy({ id });
  }

  async updateOrganization(
    dto: UpdateOrganizationModel,
  ): Promise<Partial<OrganizationEntity> | never> {
    const { id } = dto;
    const entity = await this.orgRepository.findOneBy({
      id,
    });

    if (!entity)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `组织${id}不存在`,
      );

    return await this.orgRepository.save({ ...entity, ...dto });
  }

  async getOrganizationTreeNodes(rootNodeId = ROOT_NODE_ID) {
    const all = await this.orgRepository
      .createQueryBuilder()
      .orderBy('level', 'ASC')
      .addOrderBy('sortno', 'ASC')
      .getMany();
    if (!all?.length) return [];

    const nodes = all.filter((it) => it.pid === rootNodeId);
    const rootNode = all.find((it) => it.id === rootNodeId);

    if (!rootNode && !nodes?.length) {
      return [];
    } else if (rootNode && !nodes?.length) {
      const rootTreeNode =
        OrganizationService.convertEntityToTreeNode(rootNode);
      return [rootTreeNode];
    }

    const treeNodes: OrganizationTreeNode[] = [];

    nodes.forEach((it) => {
      const treeNode = OrganizationService.convertEntityToTreeNode(it);
      const node = this.findChildren(treeNode, all);

      treeNodes.push(node);
    });

    if (rootNode) {
      const rootTreeNode =
        OrganizationService.convertEntityToTreeNode(rootNode);
      rootTreeNode.children = treeNodes;

      return [rootTreeNode];
    }

    return treeNodes;
  }

  /**
   *
   * @param pid
   * @returns
   */
  async getLevelTreeNodesByPid(pid = 0) {
    const all = await this.orgRepository
      .createQueryBuilder()
      .where({ pid: pid, status: StatusEnum.NORMAL })
      .orderBy('level', 'ASC')
      .addOrderBy('sortno', 'ASC')
      .getMany();
    if (!all?.length) return [];

    const treeNodes: OrganizationTreeNode[] = all.map((entity) =>
      OrganizationService.convertEntityToTreeNode(entity),
    );

    return treeNodes;
  }

  async addOrganization(
    dto: AddOrganizationModel,
  ): Promise<OrganizationEntity | never> {
    const someEntity = await this.checkRepeat(dto);

    const entity = this.orgRepository.save(
      await this.orgRepository.create({ ...dto, ...someEntity }),
    );

    return entity;
  }

  async updateStatus(dto: SetStatusData): Promise<StatusEnum | never> {
    const { id, status } = dto;
    const entity = await this.orgRepository.findOneBy({
      id,
    });

    if (!entity)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `组织${id}不存在`,
      );

    if (status === entity.status) return status;
    await this.orgRepository
      .createQueryBuilder()
      .update(entity)
      .set({
        status: status,
      })
      .where('id = :id', { id })
      .execute();

    return status;
  }

  async getSelectionTreeNodesByPid(
    pid: number,
  ): Promise<Array<TreeNodeOptionType>> {
    const rootOrganizations = await this.getChildrenByPid(pid);
    if (!rootOrganizations?.length) return [];

    const nodes: Array<TreeNodeOptionType> = rootOrganizations.map((e) =>
      OrganizationService.convertEntityToSelectTreeNode(e),
    );

    await this.recursiveSelectionTreeNodes(nodes);

    return nodes;
  }

  async recursiveSelectionTreeNodes(nodes: Array<TreeNodeOptionType>) {
    for (let i = 0; i < nodes.length; i++) {
      const { id } = nodes[i];
      const subEntities = await this.getChildrenByPid(id);
      if (!subEntities?.length) {
        nodes[i].isLeaf = true;
        continue;
      }

      nodes[i].children = subEntities.map((e) =>
        OrganizationService.convertEntityToSelectTreeNode(e),
      );

      this.recursiveSelectionTreeNodes(nodes[i].children);
    }
  }

  private getChildrenByPid(pid: number): Promise<Array<OrganizationEntity>> {
    return this.orgRepository
      .createQueryBuilder('org')
      .where({ pid })
      .getMany();
  }

  private findChildren(
    node: OrganizationTreeNode,
    all: OrganizationEntity[],
  ): OrganizationTreeNode {
    const pid = node.id;
    const subs: OrganizationTreeNode[] =
      all
        .filter((it) => it.pid === pid)
        ?.map((it) => OrganizationService.convertEntityToTreeNode(it)) ?? null;

    if (subs?.length) node.children = subs;
    if (!node.children?.length) return node;
    for (let i = 0; i < node.children.length; i++) {
      this.findChildren(node.children[i], all);
    }

    return node;
  }

  private async checkRepeat(
    dto: AddOrganizationModel,
  ): Promise<Partial<OrganizationEntity> | never> {
    const { name, code, pid } = dto;

    let find = await this.orgRepository
      .createQueryBuilder()
      .select()
      .where({ name: name.trim() })
      .getOne();
    if (find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `组织名称${name} 已存在`,
      );
    find = await this.orgRepository
      .createQueryBuilder()
      .select()
      .where({ code: code.trim() })
      .getOne();
    if (find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `组织编码${code} 已存在`,
      );

    const result = await this.orgRepository
      .createQueryBuilder('org')
      .select('MAX(org.sortno)', 'maxSortNo')
      .getRawOne();

    let level = 1;
    const parent = await this.orgRepository.findOneBy({ id: pid });
    if (parent && parent.level) {
      level = parent.level;
    }
    const someEntity: Partial<OrganizationEntity> = {
      sortno: result?.maxSortNo ? result?.maxSortNo + 1 : 1,
      level,
      status: StatusEnum.NORMAL,
      locking: false,
    };

    return someEntity;
  }

  static convertEntityToTreeNode(
    entity: OrganizationEntity,
  ): OrganizationTreeNode {
    const {
      id,
      pid,
      orgno,
      name,
      shortName,
      status,
      locking,
      description,
      icon,
      level,
      sortno,
    } = entity;

    return {
      id,
      pid,
      orgno,
      name,
      shortName,
      status,
      locking,
      description,
      icon,
      level,
      sortno,
    };
  }

  static convertEntityToSelectTreeNode(
    entity: OrganizationEntity,
  ): TreeNodeOptionType {
    const { id, pid, name, code, shortName, icon, level, status, locking } =
      entity;

    const node: TreeNodeOptionType = {
      id,
      key: id,
      label: name,
      pid,
      disabled: status !== StatusEnum.NORMAL,
      extra: {
        code,
        shortName,
        icon,
        level,
        locking,
      },
    };

    return node;
  }
}
