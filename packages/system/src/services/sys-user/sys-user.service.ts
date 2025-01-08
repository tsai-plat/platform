import { Injectable } from '@nestjs/common';
import { Equal, Repository, UpdateResult } from 'typeorm';
import { SystemUserEntity } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSUserModel, UpdateSUserModel } from '../../models/suser.model';

import {
  BcryptHelper,
  BizException,
  ErrorCodeEnum,
  is86Phone,
  isEmail,
  mapToObj,
  RandomHelper,
} from '@tsailab/common';

import { SystemConfigService } from '../system.config.service';
import {
  IUser,
  NextNoType,
  PlatformEnum,
  ROOT_TREE_NODE_ID,
  UserStatusEnum,
} from '@tsailab/core-types';

@Injectable()
export class SysUserService {
  public readonly nextnoType = NextNoType.USER;
  constructor(
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

  async updaetSuser(model: UpdateSUserModel) {
    const { id, username, orgid, email, phone, nickname, remark } = model;
    if (!username?.length)
      throw BizException.IllegalParamterError(`用户名必填`);
    const find = await this.getById(id);
    if (!find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `用户ID [${id}]不存在.`,
      );

    if (!email?.length && !phone.length) {
      throw BizException.IllegalParamterError(`邮箱和手机至少填写一项`);
    }
    const repeatUname = await this.checkUserNameRepeat(id, username, orgid);
    if (repeatUname > 0)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `用户名[${username}]已存在`,
      );

    if (email?.length) {
      const repeatEmail = await this.checkEmailRepeat(id, email);
      if (repeatEmail > 0)
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `用户邮箱[${email}]已绑定其他账号`,
        );
    }

    if (phone?.length) {
      const repeatPhone = await this.checkPhoneRepeat(id, phone);
      if (repeatPhone > 0)
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `用户手机[${phone}]已绑定其他账号`,
        );
    }

    const { affected } = await this.accRepository
      .createQueryBuilder()
      .update(SystemUserEntity)
      .set({
        username,
        email: email ?? find.email,
        phone: phone ?? find.phone,
        orgid: orgid ?? find.orgid,
        nickname,
        remark,
      })
      .where({ id })
      .execute();

    return affected > 0;
  }

  async checkUserNameRepeat(
    id: number,
    username: string,
    orgid?: number,
  ): Promise<number> {
    const qb = this.accRepository.createQueryBuilder('suser');

    const map = new Map();

    map.set('username', Equal(username));
    if (typeof orgid !== 'undefined') {
      map.set('orgid', Equal(orgid));
    }

    const count = await qb
      .withDeleted()
      .where(mapToObj(map))
      .andWhere('id != :id', { id })
      .getCount();

    return count;
  }

  async checkPhoneRepeat(id: number, phone: string): Promise<number> {
    const qb = this.accRepository.createQueryBuilder('suser');

    const map = new Map();
    map.set('phone', Equal(phone));

    const count = await qb
      .withDeleted()
      .where(mapToObj(map))
      .andWhere('id != :id', { id })
      .getCount();

    return count;
  }

  async checkEmailRepeat(id: number, email: string): Promise<number> {
    const qb = this.accRepository.createQueryBuilder('suser');

    const map = new Map();
    map.set('email', Equal(email));

    const count = await qb
      .withDeleted()
      .where(mapToObj(map))
      .andWhere('id != :id', { id })
      .getCount();

    return count;
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

  async initSuperUser(): Promise<string> {
    const superUsers = await this.accountReository
      .createQueryBuilder('suser')
      .withDeleted()
      .where({ isSuper: true })
      .getMany();
    if (superUsers?.length) {
      return `Super User has been exists.[${superUsers[0].username}]`;
    }
    // const nextno = await this.nextnoCacher.getNextno(this.nextnoType);
    const { uno, value } = await RandomHelper.buildUno(0, ['6489']);
    const time = new Date(1989, 5, 4).setHours(4, 15, 0, 0);
    const pass = 'admin@123';
    const enpw = await this.encryptPassword(pass);
    const created: Partial<SystemUserEntity> = {
      username: 'admin',
      phone: '18810106688',
      email: 'admin@tsailab.ai',
      nickname: value,
      orgid: ROOT_TREE_NODE_ID,
      userno: uno,
      avatar:
        'https://ucarecdn.com/f00b8fd7-326a-47b8-80f8-6c15eccb112c/appletouchicon.png',
      status: UserStatusEnum.NORMAL,
      platform: PlatformEnum.SYSTEM_PLATFORM,
      remark: 'Super Admin',
      createdAt: new Date(time),
      updatedAt: new Date(time),
      password: enpw,
      isSuper: true,
    };

    const entity = await this.accountReository.save(created);
    // await this.nextnoCacher.setHash(this.nextnoType, nextno);
    return `Super User [${entity.username}] created, password is [${pass}]`;
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
      orgid,
      avatar,
      nickname,
      unionid,
      remark,
      isSuper,
    } = entity;

    const user: IUser = {
      id,
      orgid,
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
