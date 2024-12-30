import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { SystemUserEntity } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSUserModel } from '../../models/suser.model';

import {
  BcryptHelper,
  BizException,
  ErrorCodeEnum,
  is86Phone,
  isEmail,
  RandomHelper,
} from '@tsailab/common';
import { NextNoService } from '../next-no/next-no.service';
import { SystemConfigService } from '../system.config.service';
import {
  IUser,
  NextNoBiztype,
  PlatformEnum,
  UserStatusEnum,
} from '@tsailab/core-types';

@Injectable()
export class SysUserService {
  constructor(
    private readonly nextnoService: NextNoService,
    private readonly sysConfService: SystemConfigService,
    @InjectRepository(SystemUserEntity)
    private readonly accountReository: Repository<SystemUserEntity>,
  ) {}

  public get accRepository() {
    return this.accountReository;
  }

  getById(id: number): Promise<SystemUserEntity | null> {
    return this.accountReository.findOneBy({ id });
  }

  getByUno(uno: string): Promise<SystemUserEntity | null> {
    return this.accountReository.findOneBy({ userno: uno });
  }

  async findUserByAccount(account: string): Promise<SystemUserEntity | null> {
    const qb = this.accountReository.createQueryBuilder('suser');
    const user = await qb
      .where(
        'suser.phone = :account OR suser.email = :account OR suser.userno = :no OR suser.username = :account',
        { account, no: account },
      )
      .getOne();

    if (user) {
      const { password } = await qb
        .select('suser.password', 'password')
        .where('suser.id = :id', { id: user.id })
        .getRawOne();

      user.password = password;
    }

    return user;
  }

  /**
   *
   * @param model
   */
  async createSuser(model: CreateSUserModel, enpassword?: string) {
    this.validCreateSUserModel(model);
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
      orgno,
      avatar,
      platform = PlatformEnum.SYSTEM_PLATFORM,
      isSuper = false,
    } = model;

    const qb = this.accountReository.createQueryBuilder('suser');
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

    const nextno = await this.nextnoService.getEnableNextNo(
      NextNoBiztype.USER.valueOf(),
    );
    const { uno, value } = await RandomHelper.buildUno(
      nextno,
      this.sysConfService.getUnoSeeds(),
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
      orgno,
    };

    const entity = await this.accountReository.save(
      this.accountReository.create(created),
    );

    //
    await this.nextnoService.updateNextnoUsed(
      NextNoBiztype.USER.valueOf(),
      nextno,
    );

    entity.password = '';

    return entity;
  }

  /**
   *
   * @param id
   * @param password user input password
   * @returns UpdateResult
   */
  async resetPassword(id: number, password: string): Promise<UpdateResult> {
    const encryptedPassword = await this.encryptPassword(password);
    return await this.accountReository.update(id, {
      password: encryptedPassword,
    });
  }

  setUserStatus(id: number, status: UserStatusEnum) {
    return this.accountReository.update(id, { status: status });
  }

  validCreateSUserModel(model: CreateSUserModel) {
    const { phone, email } = model;
    if (!phone?.length && !email?.length)
      throw BizException.ParameterInvalidError(
        `Expect one of phone or email has value.`,
      );
    if (phone?.length && !is86Phone(phone)) {
      throw BizException.ParameterInvalidError(`The phone [${phone}] invalid.`);
    }

    if (email?.length && !isEmail(email)) {
      throw BizException.ParameterInvalidError(`The email [${email}] invalid.`);
    }
  }

  encryptPassword(password: string) {
    return BcryptHelper.encryptPassword(
      password,
      this.sysConfService.encrptRounds,
    );
  }

  static convertToUser(entity: SystemUserEntity) {
    const {
      id,
      userno,
      username,
      email,
      phone,
      platform,
      status,
      acctype,
      openid,
      orgno,
      avatar,
      nickname,
      unionid,
      remark,
      isSuper,
    } = entity;

    const user: IUser = {
      id,
      orgno,
      userno,
      username,
      email,
      phone,
      acctype,
      status,
      platform,
      openid,
      avatar,
      nickname,
      unionid,
      remark,
      isSuper,
    };

    return user;
  }
}
