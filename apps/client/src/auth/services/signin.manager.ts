import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientConfigService,
  NextNoCacheManager,
  VerifyCodeService,
} from '@tsai-platform/core';
import {
  BizException,
  ErrorCodeEnum,
  LotoHeadersType,
  RandomHelper,
} from '@tsailab/common';
import {
  IUser,
  MQLogPayload,
  NextNoType,
  PlatformEnum,
  UserStatusEnum,
} from '@tsailab/core-types';
import { UserEntity, UserService } from '@tsailab/system';
import { isEmail, isMobilePhone } from 'class-validator';
import { ClientlogProducer } from 'src/core';
import { VerifyCodeLoginDto } from '../dto/login.dto';
import { AuthHelper } from './auth.helper';

@Injectable()
export class CustomSigninManager {
  private logger = new Logger(CustomSigninManager.name);

  private checkUserRegistered = false;
  private upsertLogined = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly authHelper: AuthHelper,
    private readonly clientlog: ClientlogProducer,
    private readonly userService: UserService,
    private readonly verifyCodeService: VerifyCodeService,
    private readonly nextnoCacher: NextNoCacheManager,
    private readonly clientConfig: ClientConfigService,
  ) {
    this.checkUserRegistered = ['1', 'on', 'true', true, 1].includes(
      this.configService.get<string | boolean | number>(
        'customLogin.precheckRegistered',
        'on',
      ),
    );

    this.upsertLogined = this.configService.get(
      'customLogin.upsertLogined',
      false,
    );
  }

  async sendVerifyCodeForLogin(account: string, reqHeaders: LotoHeadersType) {
    const launchTime = Date.now();
    const mqPayload: MQLogPayload = {
      bizcode: 'send-verify-code',
      action: `${CustomSigninManager.name}:sendVerifyCodeForLogin`,
      result: '',
      launchTime,
      options: {
        ...reqHeaders,
      },
      operator: `${account}`,
      locked: true,
    };
    try {
      if (isEmail(account)) {
        if (this.checkUserRegistered) {
          await this.precheck(account, false);
        }

        await this.verifyCodeService.sendEmailVerifyCode(account);
      } else if (isMobilePhone(account, 'zh-CN')) {
        if (this.checkUserRegistered) {
          await this.precheck(account, true);
        }
        await this.verifyCodeService.sendMobileVerifyCode(account);
      } else {
        throw BizException.IllegalParamterError(`请输入手机或电子邮箱账号`);
      }
      mqPayload.result = `验证码发送成功!`;
      await this.clientlog.publishClientLog(mqPayload);

      return true;
    } catch (error: any) {
      mqPayload.result = error?.message;
      mqPayload.error = `${JSON.stringify(error)}`.slice(0, 2000);
      await this.clientlog.publishClientLog(mqPayload);
      throw error;
    }
  }

  async verifyCodeLogin(dto: VerifyCodeLoginDto, headers: LotoHeadersType) {
    const { account, verifyCode } = dto;
    const launchTime = Date.now();
    const mqPayload: MQLogPayload = {
      bizcode: 'send-verify-code',
      action: `${CustomSigninManager.name}:sendVerifyCodeForLogin`,
      result: '验证码登录成功',
      launchTime,
      options: {
        ...headers,
      },
      reqdata: {
        account,
        verifyCode,
      },
      operator: `${account}`,
      locked: true,
    };

    try {
      let find = await this.precheckForAccountLogin(account);
      // check registered
      if (!this.upsertLogined && !find) {
        throw BizException.createError(
          ErrorCodeEnum.USER_NOT_FOUND,
          `用户[${account}]未注册!`,
        );
      }

      const valid = await this.verifyCodeService.verifyCode(
        account,
        verifyCode,
      );
      if (!valid)
        throw BizException.createError(
          ErrorCodeEnum.PARAMS_INVALID,
          `验证码不正确或已失效`,
        );

      if (!find) {
        find = await this.createUserForVerifyCodeLogin(account);
        mqPayload.result = '验证码创建用户成功';
      }

      const {
        id,
        userno,
        username,
        phone,
        email,
        acctype,
        status,
        platform,
        avatar,
      } = find;

      const u: IUser = {
        id,
        userno,
        username,
        phone,
        email,
        acctype,
        status,
        platform,
        avatar,
      };
      const tokenUser = await this.authHelper.createAccessTokenUser(
        u,
        verifyCode,
      );

      mqPayload.respdata = {
        userno,
        username,
        phone,
        email,
        acctype,
        status,
        platform,
        avatar,
      };
      await this.clientlog.publishClientLog(mqPayload);
      return tokenUser;
    } catch (error: any) {
      mqPayload.result = error?.message;
      mqPayload.error = `${JSON.stringify(error)}`.slice(0, 2000);
      await this.clientlog.publishClientLog(mqPayload);
      throw error;
    }
  }

  private async createUserForVerifyCodeLogin(
    account: string,
  ): Promise<UserEntity> {
    const find = await this.userService.findUserAccount(account);
    if (find)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_CONFLICT,
        `账户${account}已存在,请前往登录!`,
      );
    const nextno = await this.nextnoCacher.getNextno(NextNoType.USER);
    const { uno, value } = RandomHelper.buildUno(
      nextno,
      this.clientConfig.unoSeeds,
    );
    const user: Partial<UserEntity> = {
      userno: uno,
      username: account,
      nickname: value,
      platform: PlatformEnum.CUSTOM_PLATFORM,
      status: UserStatusEnum.NORMAL,
    };
    if (isEmail(account)) {
      user.email = account;
    } else {
      user.phone = account;
    }

    const repository = this.userService.respository;
    const entity = await repository.save(repository.create(user));
    return entity;
  }

  private async precheckForAccountLogin(
    account: string,
  ): Promise<UserEntity | undefined> {
    let find;
    if (isMobilePhone(account, 'zh-CN')) {
      find = await this.userService.getByPhone(account);
    } else if (isEmail(account)) {
      find = await this.userService.getByEmail(account);
    } else {
      find = await this.userService.getByUsername(account);
      if (!find) {
        find = await this.userService.getByUserno(account);
      }
    }
    if (!find) return undefined;

    if (find.status === UserStatusEnum.FORBIDDEN) {
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `${account}账号被禁用,请联系客服!`,
      );
    }

    return find;
  }

  /**
   * check before send code
   * @param account
   * @param isMobile
   * @returns
   */
  private async precheck(
    account: string,
    isMobile: boolean = false,
  ): Promise<boolean> {
    let find;
    if (isMobile) {
      find = await this.userService.getByPhone(account);
    } else {
      find = await this.userService.getByEmail(account);
    }

    if (!find)
      throw BizException.createError(
        ErrorCodeEnum.USER_NOT_FOUND,
        `账号${account}不存在,请先注册!`,
      );
    if (find.status === UserStatusEnum.FORBIDDEN)
      throw BizException.createError(
        ErrorCodeEnum.USER_FORBIDDEN,
        `账号${account}不可用,请联系客服!`,
      );

    return true;
  }
}
