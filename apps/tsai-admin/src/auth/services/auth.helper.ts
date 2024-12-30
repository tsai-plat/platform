import { ConfigService } from '@nestjs/config';
import { defaultJwtOpts, JWT_YAML_CONF_KEY } from '../auth.constants';
import {
  BcryptHelper,
  BizException,
  CacheKeyHelper,
  convertDurationVolumeToSeconds,
  ErrorCodeEnum,
  JwtConfigSchmeaOptions,
  RandomHelper,
  UuidGenerator,
} from '@tsailab/common';
import { RedisService } from '@tsailab/ioredis-mq';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import {
  AccountType,
  IUser,
  JwtAccessPayload,
  TokenUserCache,
} from '@tsailab/core-types';

/**
 * AuthHelper
 */
@Injectable()
export class AuthHelper {
  protected logger = new Logger(AuthHelper.name);
  private readonly jwtOptions: JwtConfigSchmeaOptions;
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
  ) {
    const opts = this.config.get(JWT_YAML_CONF_KEY);
    if (!opts || !opts.secretKey?.length) {
      throw BizException.ConfigurationError(`JWT configuration loading error.`);
    }

    this.jwtOptions = { ...defaultJwtOpts, ...opts } as JwtConfigSchmeaOptions;
  }

  /**
   * 创建Token, 创建前检查 用户password & exists in DB
   *
   * @param user
   * @param state
   * @returns token
   */
  async createAccessToken(
    user: IUser,
    state: string = RandomHelper.randomState(),
  ) {
    const key = await this.getTokenKey(user.id, user.clit, user.acctype);
    const payload = await this.buildAccessPayload(user, state);
    const token = await this.jwt.sign(payload);
    const cache: TokenUserCache = {
      ...user,
      token,
    };
    await this.redis.setData(key, cache, this.expireinSeconds);
    return token;
  }

  private get encrptRounds(): number {
    return this.jwtOptions?.encrptRounds ?? 10;
  }

  /**
   *
   * 调用 createAccessToken 前
   * @param user
   * @returns TokenUserCache or null
   */
  async checkTokenExists(
    id: number,
    clit: string = '_',
    acctype?: AccountType,
  ): Promise<TokenUserCache | never> {
    const key = await this.getTokenKey(id, clit, acctype);
    const cache = await this.redis.getData(key);

    return cache ? (cache as any as TokenUserCache) : null;
  }

  /**
   * Token 续期，请在 getUerInfo 时 调用
   *  正常返回IUser
   *  异常时 code : 401
   * @param token
   * @returns IUser
   */
  async renewToken(token: string): Promise<IUser | never> {
    const payload = await this.decryptToken(token);
    if (!payload)
      throw BizException.createError(
        ErrorCodeEnum.UNAUTHORIZED,
        `当前 Token 已失效,请重新登录!`,
      );
    const { id, acctype, clit } = payload;
    const key = await this.getTokenKey(id, clit, acctype);
    const cache = await this.redis.getData<TokenUserCache>(key);
    if (!cache)
      throw BizException.createError(
        ErrorCodeEnum.UNAUTHORIZED,
        `当前 Token 已失效,请重新登录!`,
      );
    await this.redis.setExpires(key, this.expireinSeconds);
    const { token: _tk, ...user } = cache;
    return { ...user } as IUser;
  }

  /**
   *
   * 加密用户密码
   * @param password
   * @returns string
   */
  async encryptPassword(password: string): Promise<string> {
    return BcryptHelper.encryptPassword(password);
  }

  /**
   *
   * @param password string
   * @param encrypted 's0/\/\P4$$w0rD'
   * @returns boolean
   */
  async comparePassword(
    password: string = '',
    encrypted: string = '',
  ): Promise<boolean> {
    return await BcryptHelper.validPassword(password, encrypted);
  }

  private async buildAccessPayload(user: IUser, state?: string) {
    const { id, username, userno, acctype, avatar } = user;
    const { version } = this.jwtOptions;

    // const now = new Date();
    const jti = await UuidGenerator.createJti();

    const payload: JwtAccessPayload = {
      version,
      jti,
      id,
      aud: acctype,
      username,
      cid: userno,
      acctype,
      avatar,
      nonce: state ?? RandomHelper.randomState(),
    };

    return payload;
  }

  /**
   *
   * @param id user id
   * @param clit client id
   * @param acctype user accountType
   * @returns string
   */
  getTokenKey(id: number, clit: string = '_', acctype?: AccountType): string {
    return CacheKeyHelper.buildAccessTokenKey(id, clit, acctype);
  }

  async decryptToken(token: string): Promise<JwtAccessPayload> {
    return await this.jwt.decode<JwtAccessPayload>(token);
  }

  private get expireinSeconds(): number {
    const { expirein } = this.jwtOptions;

    return convertDurationVolumeToSeconds(expirein);
  }
}
