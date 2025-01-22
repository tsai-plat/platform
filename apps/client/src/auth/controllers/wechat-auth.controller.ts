import { Body, Controller, Post } from '@nestjs/common';
import { WechatAuthorizeService } from '../services';

import { WechatAuthorizeParam } from '@tsailab/core-types';
import { LotoHeadersType } from '@tsailab/common';
import { LotoHeaders, PublicApi } from '@tsai-platform/core';

@Controller('wechat')
export class WechatAuthController {
  constructor(private readonly wechatAuthService: WechatAuthorizeService) {}

  @PublicApi()
  @Post('slient_login')
  tryLogin(
    @Body() dto: WechatAuthorizeParam,
    @LotoHeaders() reqHeaders: LotoHeadersType,
  ) {
    return this.wechatAuthService.slientLogin(dto, reqHeaders);
  }

  @PublicApi()
  @Post('registered')
  slientRegisteredAndLogin(
    @Body() dto: WechatAuthorizeParam,
    @LotoHeaders() reqHeaders: LotoHeadersType,
  ) {
    return this.wechatAuthService.slientRegistered(dto, reqHeaders);
  }
}

