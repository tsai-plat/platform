import { Injectable } from '@nestjs/common';
import { Equal, Like, Not, Repository } from 'typeorm';
import { RoleEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BizException,
  ErrorCodeEnum,
  mapToObj,
  QueryOptionsDto,
} from '@tsailab/common';
import { PageEnum, SetStatusData } from '@tsailab/core-types';
import { CreateRoleModel } from '../models';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  get repository(): Repository<RoleEntity> {
    return this.roleRepository;
  }

  getById(id: number): Promise<RoleEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async queryList(params: QueryOptionsDto) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
    } = params;

    const qb = this.roleRepository.createQueryBuilder('role');

    const map = new Map<string, any>();
    if (keywords?.length) {
      map.set('name', Like(`%${keywords}%`));
    }

    const [data, total] = await qb
      .andWhere(mapToObj(map))
      .withDeleted()
      .orderBy('name', 'ASC')
      .offset((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: data ?? [],
    };
  }

  async setRoleStatus(data: SetStatusData) {
    const { id, status } = data;
    const find = await this.getById(id);
    if (!find)
      throw BizException.createError(ErrorCodeEnum.DATA_RECORD_REMOVED);
    const { affected } = await this.repository
      .createQueryBuilder('role')
      .update(RoleEntity)
      .set({
        status,
      })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async setDefault(id: number) {
    const find = await this.getById(id);
    if (!find)
      throw BizException.createError(ErrorCodeEnum.DATA_RECORD_REMOVED);
    const qb = this.repository.createQueryBuilder('role');
    const { affected: canceled } = await qb
      .update(RoleEntity)
      .set({ isDefault: false })
      .where('id != :id', { id })
      .execute();

    const { affected } = await qb
      .update(RoleEntity)
      .set({ isDefault: true })
      .where({ id })
      .execute();

    return affected > 0 || canceled > 0;
  }

  async addRole(model: CreateRoleModel): Promise<RoleEntity | never> {
    const { name } = model;
    if (name?.length)
      throw BizException.IllegalParamterError(`Role name required.`);
    const qb = this.roleRepository.createQueryBuilder('role');

    const find = await qb.where('role.name = :name', { name }).getOne();
    if (find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `Role [${name}] has been exists in DB.`,
      );

    const role = await this.repository.save(
      this.repository.create({ ...model }),
    );
    return role;
  }

  async updateRole(
    role: Partial<RoleEntity> & { id: number },
  ): Promise<RoleEntity | never> {
    const { id, name, ...others } = role;
    const find = await this.getById(id);
    const qb = this.repository.createQueryBuilder('role');

    if (!find)
      throw BizException.createError(ErrorCodeEnum.DATA_RECORD_REMOVED);

    if (name?.length && name !== find.name) {
      const conflicted = await qb
        .where({
          name: Equal(name),
        })
        .andWhere({ id: Not(id) })
        .getOne();

      if (conflicted)
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `Role [${name}] has been exists in DB.`,
        );
    }

    await qb
      .update(RoleEntity)
      .set({
        ...others,
        name: name ?? find.name,
      })
      .where({ id }).execute;

    return { ...find, ...others, name: name ?? find.name } as RoleEntity;
  }
}
