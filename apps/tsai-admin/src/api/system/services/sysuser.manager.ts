import {
  SystemConfigService,
  SystemUserEntity,
  SysUserService,
} from '@tsailab/system';
import { QueryAdminUserReqDto, ResetSysUserPwdDto } from '../dtos';
import { Injectable, Logger } from '@nestjs/common';
import {
  CreateSUserModel,
  UpdateSUserModel,
} from '@tsailab/system/dist/models/suser.model';
import { ConfigService } from '@nestjs/config';
import {
  BcryptHelper,
  BizException,
  ErrorCodeEnum,
  mapToObj,
  RandomHelper,
  UpdateUserStatusModel,
} from '@tsailab/common';
import { Like } from 'typeorm';
import {
  IUser,
  PageEnum,
  PlatformEnum,
  ROOT_TREE_NODE_ID,
  UserStatusEnum,
} from '@tsailab/core-types';
import { NextNoCacheManager } from '@tsai-platform/core';

@Injectable()
export class SysUserManager {
  protected logger = new Logger(SysUserManager.name);

  constructor(
    private readonly sysUserService: SysUserService,
    private readonly sysConfigService: SystemConfigService,
    private readonly config: ConfigService,
    private readonly nextnoCacher: NextNoCacheManager,
  ) {}

  async queryList(dto: QueryAdminUserReqDto, filterDeleted = true) {
    let qb = this.sysUserService.accRepository.createQueryBuilder('suser');

    const map = new Map<string, any>();
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
      mobile,
    } = dto;
    if (mobile?.length) {
      map.set('phone', Like(`%${mobile}%`));
    }
    qb = qb.where(mapToObj(map));

    if (keywords?.length) {
      qb = qb.andWhere(
        'suser.username LIKE :keywords OR suser.email LIKE :keywords OR suser.userno LIKE :keywords',
        {
          keywords: `%${keywords}%`,
        },
      );
    }

    if (!filterDeleted) {
      qb = qb.withDeleted();
    }

    const [data, total] = await qb
      .orderBy('created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: data ?? [],
    };
  }

  async updateSystemUserStatus(dto: UpdateUserStatusModel) {
    const { id, status } = dto;
    const { affected } = await this.sysUserService.setUserStatus(id, status);
    return affected > 0;
  }

  async resetSystemUserPassword(dto: ResetSysUserPwdDto, user: IUser) {
    if (!user?.id || !user.isSuper) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        '您无权重置密码,请联系超级管理员!',
      );
    }
    if (dto.id === user.id) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        '不能重置自己的密码',
      );
    }
    const { id, password } = dto;
    await this.sysConfigService.verifyPasswordStrength(password);
    const { affected } = await this.sysUserService.resetPassword(id, password);
    return affected > 0;
  }

  async resetSystemUserPasswordByDefault(id: number, user: IUser) {
    if (!user?.id || !user.isSuper) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        '您无权重置密码,请联系超级管理员!',
      );
    }
    if (id === user.id) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        '不能重置自己的密码',
      );
    }

    const password = await this.sysConfigService.suserDefaultPw;
    const { affected } = await this.sysUserService.resetPassword(id, password);
    return affected > 0;
  }

  async createSystemUser(dto: CreateSUserModel) {
    const pw = await this.config.get<string>(
      'system.defaultPassword',
      'Admin@tsai',
    );

    if (!dto.password?.length) {
      dto.password = pw;
    }
    return await this.createSuser(dto);
  }

  /**
   *
   * @param model
   */
  async createSuser(model: CreateSUserModel, enpassword?: string) {
    this.sysUserService.validCreateSUserModel(model);
    if (!model.password && !enpassword) {
      throw BizException.IllegalParamterError(
        `Password in model or enpassword at latest one.`,
      );
    }

    const {
      phone,
      email,
      openid,
      username,
      orgid = ROOT_TREE_NODE_ID,
      avatar,
      platform = PlatformEnum.SYSTEM_PLATFORM,
      isSuper = false,
    } = model;

    const accRepository = this.sysUserService.accRepository;
    const qb = accRepository.createQueryBuilder('suser');
    let dbUser;
    if (phone?.length) {
      dbUser = await qb.where({ phone }).getOne();
      if (dbUser) {
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `The phone [${phone}] has been exists in System.`,
        );
      }
    }
    if (email?.length) {
      dbUser = await qb.where({ email }).getOne();
      if (dbUser) {
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `The email [${email}] has been exists in System.`,
        );
      }
    }

    if (openid?.length) {
      dbUser = await qb.where({ openid }).getOne();
      if (dbUser) {
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `The Wechat openid has been bind an user in System.`,
        );
      }
    }

    const enpw = enpassword?.length
      ? enpassword
      : await BcryptHelper.encryptPassword(model.password);

    const nextno = await this.nextnoCacher.getNextno(
      this.sysUserService.nextnoType,
    );
    const { uno, value } = await RandomHelper.buildUno(
      nextno,
      this.sysConfigService.getUnoSeeds(),
    );

    const created: Partial<SystemUserEntity> = {
      userno: uno,
      username: username ?? uno,
      nickname: username ?? value,
      phone,
      email,
      password: enpw,
      avatar,
      status: UserStatusEnum.NORMAL,
      isSuper,
      platform,
      openid,
      orgid,
    };

    const entity = await accRepository.save(accRepository.create(created));

    // set used
    await this.nextnoCacher.setHash(this.sysUserService.nextnoType, nextno);

    entity.password = '';

    return entity;
  }

  async setUserIsSuper(id: number, isSuper: boolean = false) {
    const find = await this.sysUserService.getById(id);
    if (!find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `用户不存在`,
      );
    const { affected } = await this.sysUserService.accRepository
      .createQueryBuilder('user')
      .update(SystemUserEntity)
      .set({ isSuper })
      .where({ id })
      .execute();

    return affected > 0;
  }

  updateSystemUserSome(dto: UpdateSUserModel) {
    return this.sysUserService.updaetSuser(dto);
  }
}
