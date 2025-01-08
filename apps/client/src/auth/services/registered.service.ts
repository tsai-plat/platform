import { Injectable } from '@nestjs/common';
import { ClientConfigService, NextNoCacheManager } from '@tsai-platform/core';
import {
  MQLogPayload,
  NextNoType,
  PlatformEnum,
  UserStatusEnum,
} from '@tsailab/core-types';
import { UserEntity, UserService } from '@tsailab/system';
import { CustomSigninDto, QuickRegisteredUser } from '../dto';
import {
  BizException,
  ErrorCodeEnum,
  LotoHeadersType,
  RandomHelper,
} from '@tsailab/common';
import { isEmail, isMobilePhone } from 'class-validator';
import { ClientlogProducer } from 'src/core';
import { AuthHelper } from './auth.helper';
import { IUser } from '@tsailab/core-types';

@Injectable()
export class CustomRegisteredService {
  constructor(
    private readonly userService: UserService,
    private readonly nextnoCacher: NextNoCacheManager,
    private readonly clientlog: ClientlogProducer,
    private readonly authHelper: AuthHelper,
    private readonly clientConfig: ClientConfigService,
  ) {}

  async quickSignin(dto: QuickRegisteredUser, headers: LotoHeadersType) {
    const {
      account,
      platform = PlatformEnum.UNKNOW_PLATFORM,
      status = UserStatusEnum.GUEST,
    } = dto;
    const { reqid, cliid, ip, clit } = headers;
    const mqpayload: MQLogPayload = {
      bizcode: 'custom-quick-regist',
      action: `${CustomRegisteredService.name}:quickSignin`,
      result: '',
      launchTime: Date.now(),
      options: {
        ip,
        cliid,
        reqid,
      },
      operator: account,
      locked: true,
    };
    const nextno = await this.nextnoCacher.getNextno(NextNoType.USER);
    try {
      const find = await this.userService.findUserAccount(account);
      if (find)
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `账户${account}已存在,请前往登录!`,
        );

      const { uno, value } = RandomHelper.buildUno(
        nextno,
        this.clientConfig.unoSeeds,
      );
      const user: Partial<UserEntity> = {
        userno: uno,
        username: account,
        nickname: value,
        platform,
        status,
      };
      if (isEmail(account)) {
        user.email = account;
      }
      if (isMobilePhone(account, 'zh-CN')) {
        user.phone = account;
      }

      const repository = this.userService.respository;
      const { id, username, phone, acctype, avatar } = await repository.save(
        repository.create(user),
      );

      mqpayload.result = `${account} 注册成功！`;
      await this.clientlog.publishClientLog(mqpayload);
      await this.nextnoCacher.setHash(NextNoType.USER, nextno);

      const u: IUser = {
        id,
        username,
        clit,
        userno: uno,
        phone,
        acctype,
        status,
        platform,
        avatar,
      };
      const token = await this.authHelper.createAccessToken(u);

      return token;
    } catch (ex: any) {
      await this.nextnoCacher.reclaimNextno(nextno, NextNoType.USER);
      mqpayload.result = ex?.message ?? `${account} 注册失败!`;
      mqpayload.error = `${JSON.stringify(ex)}`.slice(0, 2000);
      await this.clientlog.publishClientLog(mqpayload);

      throw ex;
    }
  }

  async registeredCustomAccount(
    dto: CustomSigninDto,
    headers: LotoHeadersType,
  ) {
    const {
      phone,
      email,
      password,
      platform = PlatformEnum.UNKNOW_PLATFORM,
      status = UserStatusEnum.GUEST,
    } = dto;

    await this.clientConfig.verifyPasswordStrength(password);

    let username = dto?.username ?? email ?? phone;
    const { reqid, cliid, ip, clit } = headers;
    const mqpayload: MQLogPayload = {
      bizcode: 'custom-quick-regist',
      action: `${CustomRegisteredService.name}:quickSignin`,
      result: '',
      launchTime: Date.now(),
      options: {
        ip,
        cliid,
        reqid,
      },
      operator: username ?? phone ?? email,
      locked: true,
    };

    const nextno = await this.nextnoCacher.getNextno(NextNoType.USER);
    try {
      let find;
      if (phone) {
        find = await this.userService.getByPhone(phone);
        if (find)
          throw BizException.createError(
            ErrorCodeEnum.DATA_RECORD_CONFLICT,
            `手机号[${phone}]已注册!`,
          );
      }
      if (email) {
        find = await this.userService.getByEmail(email);
        if (find)
          throw BizException.createError(
            ErrorCodeEnum.DATA_RECORD_CONFLICT,
            `Email[${email}]已注册!`,
          );
      }

      const { uno, value } = await RandomHelper.buildUno(
        nextno,
        this.clientConfig.unoSeeds,
      );
      find = await this.userService.getByUsername(username);
      if (find && dto.username) {
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `用户名[${username}]已注册!`,
        );
      } else if (find && !dto.username?.length) {
        username = uno;
      }

      const enpw = await this.authHelper.encryptPassword(password);
      const user: Partial<UserEntity> = {
        userno: uno,
        username: username,
        phone,
        email,
        password: enpw,
        nickname: value,
        platform,
        status,
      };
      const repository = this.userService.respository;
      const { id, acctype } = await repository.save(repository.create(user));

      mqpayload.result = `${phone ?? email} 注册成功！`;
      await this.clientlog.publishClientLog(mqpayload);
      await this.nextnoCacher.setHash(NextNoType.USER, nextno);

      const u: IUser = {
        id,
        userno: uno,
        username,
        password: enpw,
        phone,
        email,
        platform,
        status,
        nickname: value,
        clit,
        acctype,
      };
      const token = await this.authHelper.createAccessToken(u);

      return token;
    } catch (ex: any) {
      await this.nextnoCacher.reclaimNextno(nextno, NextNoType.USER);
      mqpayload.result = ex?.message ?? `账号${mqpayload.operator} 注册失败!`;
      mqpayload.error = `${JSON.stringify(ex)}`.slice(0, 2000);
      await this.clientlog.publishClientLog(mqpayload);
      throw ex;
    }
  }
}
