import { Injectable } from '@nestjs/common';
import {
  ClientConfigService,
  NextNoCacheManager,
  WechatGHSDKClient,
} from '@tsai-platform/core';
import { BizException, LotoHeadersType, RandomHelper } from '@tsailab/common';
import {
  APIHttpStatus,
  IUser,
  MQLogPayload,
  NextNoType,
  PlatformEnum,
  UserStatusEnum,
  WechatAuthorizeParam,
  WechatUser,
} from '@tsailab/core-types';
import { UserEntity, UserService } from '@tsailab/system';
import { ClientlogProducer } from 'src/core';
import { AuthHelper } from './auth.helper';

@Injectable()
export class WechatAuthorizeService {
  constructor(
    private readonly wxClient: WechatGHSDKClient,
    private readonly userService: UserService,
    private readonly clientlog: ClientlogProducer,
    private readonly authHelper: AuthHelper,
    private readonly nextnoCacher: NextNoCacheManager,
    private readonly clientConfig: ClientConfigService,
  ) {}

  /**
   *
   * @param dto
   * @param reqHeaders
   * @returns
   */
  async slientLogin(dto: WechatAuthorizeParam, reqHeaders: LotoHeadersType) {
    const { code, state } = dto;
    const launchTime = Date.now();
    const mqPayload: MQLogPayload = {
      bizcode: 'custom-wx-login',
      action: `${WechatAuthorizeService.name}:slientLogin`,
      result: '',
      launchTime,
      options: {
        ...reqHeaders,
      },
      operator: `wechat-authorize-${code}`,
      locked: true,
    };
    if (!code?.length || !state?.length)
      throw BizException.IllegalParamterError(
        `Arguments of code and state required.[code:${code},state:${state}]`,
      );
    try {
      const { openid } = await this.wxClient.fetchAccessToken(code);
      const user = await this.userService.getByOpenid(openid);

      if (!user)
        throw BizException.createError(
          APIHttpStatus.UNAUTHORIZED_NEED_MORE_INFO,
          `首次登录需要微信用户授权!`,
        );

      const { id, username, userno, avatar, phone, acctype, status, platform } =
        user;
      const u: IUser = {
        id,
        clit: reqHeaders.clit,
        username,
        userno,
        avatar,
        phone,
        acctype,
        status,
        platform,
      };
      const tokenUser = await this.authHelper.createAccessTokenUser(u, state);

      mqPayload.result = `${userno} 微信授权登录成功!`;
      await this.clientlog.publishClientLog(mqPayload);
      return tokenUser;
    } catch (error: any) {
      mqPayload.result = error?.message;
      mqPayload.error = `${JSON.stringify(error)}`.slice(0, 2000);
      await this.clientlog.publishClientLog(mqPayload);
      throw error;
    }
  }

  /**
   *
   * @param dto
   * @param reqHeaders
   */
  async slientRegistered(
    dto: WechatAuthorizeParam,
    reqHeaders: LotoHeadersType,
  ) {
    const { code, state } = dto;
    const launchTime = Date.now();
    const mqPayload: MQLogPayload = {
      bizcode: 'custom-wx-login',
      action: `${WechatAuthorizeService.name}:slientRegistered`,
      result: '',
      launchTime,
      options: {
        ...reqHeaders,
      },
      operator: `wechat-authorize-${code}`,
      locked: true,
    };

    try {
      const { openid } = await this.wxClient.fetchAccessToken(code);

      let user: Partial<UserEntity> =
        await this.userService.getByOpenid(openid);
      if (!user) {
        const wechatUser: WechatUser = await this.wxClient.getUserInfo(openid);
        const { nickname, city, province, country, unionid, headimgurl } =
          wechatUser;
        const nextno = await this.nextnoCacher.getNextno(NextNoType.USER);
        const { uno, value } = RandomHelper.buildUno(
          nextno,
          this.clientConfig.unoSeeds,
        );
        const find = await this.userService.getByUsername(nickname);
        const findPhone = dto.phone?.length
          ? await this.userService.getByPhone(dto.phone)
          : undefined;

        let remark: string = [city, province, country]
          .filter((v) => !v?.length)
          .join(',');
        if (!remark?.length) {
          remark = value;
        }

        user = {
          username: find ? uno : nickname,
          userno: uno,
          nickname,
          status: UserStatusEnum.NORMAL,
          platform: PlatformEnum.WECHAT_PLATFORM,
          phone: findPhone ? undefined : dto.phone,
          openid,
          unionid,
          avatar: headimgurl,
          remark,
        };

        const repository = this.userService.respository;
        user = await repository.save(repository.create(user));
        mqPayload.result = `微信用户${nickname}[${uno}]注册成功!`;
      }

      const { id, userno, username, phone, status, platform, acctype, avatar } =
        user;
      const u: IUser = {
        id,
        username,
        clit: reqHeaders?.clit,
        userno,
        phone,
        acctype,
        status,
        platform,
        avatar,
      };
      const tokenUser = await this.authHelper.createAccessTokenUser(u, state);
      if (!mqPayload.result?.length) {
        mqPayload.result = `微信用户${username}[${userno}]授权登录成功!`;
      }
      await this.clientlog.publishClientLog(mqPayload);
      return tokenUser;
    } catch (error: any) {
      mqPayload.result = error?.message;
      mqPayload.error = `${JSON.stringify(error)}`.slice(0, 2000);
      await this.clientlog.publishClientLog(mqPayload);
      // TODO handle
      if (error instanceof BizException) {
        throw error;
      } else {
        throw BizException.createError(
          APIHttpStatus.VENDOR_AUTHORIZATION_FAIL,
          error?.message ?? '微信授权登录失败',
        );
      }
    }
  }
}
