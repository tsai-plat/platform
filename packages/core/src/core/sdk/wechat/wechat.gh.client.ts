import { Injectable, Logger } from '@nestjs/common';
import { WechatAuthorizeSchema } from './types/config.schema';
import { ConfigService } from '@nestjs/config';
import {
  BizException,
  buildSDKApiUrl,
  CacheKeyHelper,
  CacheKeyScope,
} from '@tsailab/common';
import { HttpService } from '@nestjs/axios';
import {
  APIHttpStatus,
  WechatAccessToken,
  WechatErrorResponse,
  WechatUser,
} from '@tsailab/core-types';
import { WechatSDKApiPath } from './open.api.enum';
import { catchError, lastValueFrom } from 'rxjs';
import { RedisService } from '@tsailab/ioredis-mq';

const AUTH20_WXGH_PATH = 'auth20.wxgh';
@Injectable()
export class WechatGHSDKClient {
  private logger = new Logger(WechatGHSDKClient.name);

  private readonly apiBaseUrl = 'https://api.weixin.qq.com';
  private authOptions: WechatAuthorizeSchema;

  private readonly baseHeaders = {
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {
    const authOpts = this.config.get<WechatAuthorizeSchema>(AUTH20_WXGH_PATH);
    if (!authOpts || !authOpts?.appid?.length) {
      throw BizException.ConfigurationError(
        `Loading wechat authorize config [${AUTH20_WXGH_PATH}] error.`,
      );
    }

    this.authOptions = authOpts;
  }

  get cacheExpiresin(): number {
    const { cacheExpiresin = 604800 } = this.authOptions || {};
    return cacheExpiresin;
  }

  /**
   *
   * @param code
   * @param state
   * @returns
   */
  async fetchAccessToken(code: string): Promise<WechatAccessToken> {
    if (!code?.length)
      throw BizException.ParameterInvalidError(`Required code argument`);
    const created = Date.now();

    const codeKey = this.buildAccessTokenKey('code', code);

    const lastCache = await this.redisService.getData(codeKey);
    if (lastCache) {
      return {
        ...lastCache,
      } as WechatAccessToken;
    }

    const { appid, appsecret } = await this.checkOptions();
    const queryParams = {
      appid,
      secret: appsecret,
      grant_type: 'authorization_code',
      code,
    };

    const url = buildSDKApiUrl(
      this.apiBaseUrl,
      WechatSDKApiPath.getAccessToken,
      queryParams,
    );

    const fetchResp = this.httpService.request({
      method: 'POST',
      url,
      headers: {
        ...this.baseHeaders,
      },
    });

    const { data: respData } = await lastValueFrom(
      fetchResp.pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    if (respData?.errcode) {
      this.logger.error(
        `Wechat fetch url:${url} failed.\n ${JSON.stringify(respData)}`,
      );
      const { errcode, errmsg } = respData as WechatErrorResponse;
      // const msg = wechatErrorMessage(errcode, errmsg);
      throw BizException.createError(
        APIHttpStatus.VENDOR_AUTHORIZATION_FAIL,
        `${errcode}:${errmsg}`,
      );
    }

    const ret = { ...respData, created: created } as WechatAccessToken;

    try {
      // one hours
      await this.redisService.setData(codeKey, ret, 3600);
      const key = this.buildAccessTokenKey(ret.openid, 'gh');
      await this.redisService.setData(key, ret, this.cacheExpiresin);
    } catch (ex: any) {
      this.logger.error(`Set wechat access token error: ${ex?.message}`);
    }

    return ret;
  }

  /**
   *
   * @param openid
   * @param code
   * @returns
   */
  async getAccessToken(
    openid: string,
    code?: string,
  ): Promise<WechatAccessToken | never> {
    const key = this.buildAccessTokenKey(openid, 'gh');
    const cacheToken = await this.redisService.getData<WechatAccessToken>(key);
    if (!cacheToken) {
      if (!code?.length) {
        this.logger.warn('Get wechat access token miss code parameter.');
        return;
      }

      return await this.fetchAccessToken(code);
    }

    if (this.validAccessTokenExpires(cacheToken as WechatAccessToken)) {
      return cacheToken as WechatAccessToken;
    }

    const { refresh_token } = cacheToken;
    const refressToken = await this.refreshAccessToken(refresh_token);

    const newToken: WechatAccessToken = {
      ...cacheToken,
      ...refressToken,
    };

    try {
      await this.redisService.setData(key, newToken, this.cacheExpiresin);
    } catch (ex: any) {
      this.logger.error(`Set wechat access token error: ${ex?.message}`);
    }

    return newToken;
  }

  /**
   *
   * @param refreshToken
   * @returns
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<Omit<WechatAccessToken, 'unionid' | 'is_snapshotuser'> | never> {
    const { appid } = await this.checkOptions();
    const now = Date.now();

    const url = buildSDKApiUrl(
      this.apiBaseUrl,
      WechatSDKApiPath.refreshAccessToken,
      { appid, refresh_token: refreshToken, grant_type: 'refresh_token' },
    );
    const fetchResp = this.httpService.request({
      method: 'POST',
      url,
      headers: {
        ...this.baseHeaders,
      },
    });

    const { data: respData } = await lastValueFrom(
      fetchResp.pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    if (respData?.errcode) {
      this.logger.error(
        `Wechat fetch url:${url} failed.\n ${JSON.stringify(respData)}`,
      );
      const { errcode, errmsg } = respData as WechatErrorResponse;
      // const msg = wechatErrorMessage(errcode, errmsg);
      throw BizException.createError(
        APIHttpStatus.VENDOR_AUTHORIZATION_FAIL,
        `${errcode}:${errmsg}`,
      );
    }

    return { ...respData, created: now } as Omit<
      WechatAccessToken,
      'unionid' | 'is_snapshotuser'
    >;
  }

  async getUserInfo(openid: string): Promise<WechatUser> {
    const cacheToken = await this.getAccessToken(openid);
    if (!cacheToken) {
      this.logger.error(`缓存Token失,需要用户重新授权.`);
      throw BizException.createError(
        APIHttpStatus.UNAUTHORIZED_NEED_MORE_INFO,
        `缓存Token失,需要用户重新授权.`,
      );
    }
    const queryParams = {
      access_token: cacheToken.access_token,
      openid,
      lang: 'zh_CN',
    };

    const url = buildSDKApiUrl(
      this.apiBaseUrl,
      WechatSDKApiPath.getUserInfo,
      queryParams,
    );

    const fetchResp = this.httpService.request({
      method: 'POST',
      url,
      headers: {
        ...this.baseHeaders,
      },
    });

    const { data: respData } = await lastValueFrom(
      fetchResp.pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    if (respData?.errcode) {
      this.logger.error(
        `Wechat fetch url:${url} failed.\n ${JSON.stringify(respData)}`,
      );
      const { errcode, errmsg } = respData as WechatErrorResponse;

      throw BizException.createError(
        APIHttpStatus.VENDOR_AUTHORIZATION_FAIL,
        `${errcode}:${errmsg}`,
      );
    }

    return respData as WechatUser;
  }

  private checkOptions(): WechatAuthorizeSchema {
    if (!this.authOptions.appid?.length || !this.authOptions.appsecret?.length)
      throw BizException.ConfigurationError(
        `Miss Auth2.0 configuration for wechat`,
      );
    return this.authOptions;
  }

  buildAccessTokenKey(openid: string, suffixScope: string = 'gh'): string {
    return CacheKeyHelper.buildVendorTokenKey(
      CacheKeyScope.WECHAT_AUTH_TOKEN,
      openid,
      suffixScope,
    );
  }

  validAccessTokenExpires(tokenCache: WechatAccessToken): boolean {
    const { created = 0, expires_in = 7200 } = tokenCache;
    return expires_in + created > Date.now();
  }
}
