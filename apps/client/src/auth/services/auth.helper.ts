import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  BcryptHelper,
  BizException,
  CacheKeyHelper,
  convertDurationVolumeToSeconds,
  JwtConfigSchmeaOptions,
  RandomHelper,
  UuidGenerator,
} from '@tsailab/common';
import { RedisService } from '@tsailab/ioredis-mq';
import { defaultJwtOpts, JWT_YAML_CONF_KEY } from '../auth.constants';
import {
  AccountType,
  IUser,
  JwtAccessPayload,
  TokenUserCache,
} from '@tsailab/core-types';

/**
 * @see document
 *
 */
@Injectable()
export class AuthHelper {
  protected logger = new Logger(AuthHelper.name);
  private readonly jwtOptions: JwtConfigSchmeaOptions;

  constructor(
    private readonly config: ConfigService,
    private readonly cacheService: RedisService,
    private readonly jwt: JwtService,
  ) {
    const opts = this.config.get(JWT_YAML_CONF_KEY);
    if (!opts || !opts.secretKey?.length) {
      throw BizException.ConfigurationError(`JWT configuration loading error.`);
    }
    this.jwtOptions = { ...defaultJwtOpts, ...opts } as JwtConfigSchmeaOptions;
  }

  async createAccessToken(
    user: IUser,
    state: string = RandomHelper.randomState(),
  ) {
    const cacheKey = this.getTokenKey(user.id, user.clit, user.acctype);
    const payload = await this.buildAccessPayload(user, state);
    const token = await this.jwt.sign(payload);
    const cache: TokenUserCache = {
      ...user,
      token,
    };

    await this.cacheService.setData(cacheKey, cache, this.expireinSeconds);

    return token;
  }

  /**
   *
   * @param user
   * @param state
   * @returns TokenUserCache
   */
  async createAccessTokenUser(
    user: IUser,
    state: string = RandomHelper.randomState(),
  ): Promise<TokenUserCache> {
    const cacheKey = this.getTokenKey(user.id, user.clit, user.acctype);
    const payload = await this.buildAccessPayload(user, state);
    const token = await this.jwt.sign(payload);
    const cache: TokenUserCache = {
      ...user,
      token,
    };

    await this.cacheService.setData(cacheKey, cache, this.expireinSeconds);

    return cache;
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

  /**
   *
   * @param id
   * @param clit
   * @param acctype
   * @returns
   */
  async revalidateToken(
    id: number,
    clit: string = '_',
    acctype: AccountType = 'custom',
  ): Promise<TokenUserCache | null> {
    const key = this.getTokenKey(id, clit, acctype);
    const cache = await this.cacheService.getData(key);

    return cache ? (cache as any as TokenUserCache) : null;
  }

  getTokenKey(id: number, clit: string = '_', acctype: AccountType = 'custom') {
    return CacheKeyHelper.buildAccessTokenKey(id, clit, acctype);
  }

  async decryptToken(token: string): Promise<JwtAccessPayload> {
    return await this.jwt.decode<JwtAccessPayload>(token);
  }

  /**
   * build client  jwt payload
   * @param user user
   * @param state
   * @returns payload
   */
  private async buildAccessPayload(user: IUser, state?: string) {
    const { id, username, userno, acctype, avatar, clit } = user;
    const { version } = this.jwtOptions;

    // const now = new Date();
    const jti = await UuidGenerator.createJti();

    const payload: JwtAccessPayload = {
      version,
      jti,
      id,
      aud: acctype,
      clit,
      username,
      cid: userno,
      acctype,
      avatar,
      nonce: state ?? RandomHelper.randomState(),
    };

    return payload;
  }

  private get expireinSeconds(): number {
    const { expirein } = this.jwtOptions;

    return convertDurationVolumeToSeconds(expirein);
  }
}
