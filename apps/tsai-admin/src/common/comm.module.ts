import { Global, Module } from '@nestjs/common';
import { WechatOauthController } from './auth/wechat-oauth.controller';
import { CaptchaController } from './captcha/captcha.controller';
import { RouterModule } from '@nestjs/core';
import { AdminManager } from './services';
import { CaptchaService } from '@tsai-platform/core';

@Global()
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'comm',
        module: CommModule,
      },
    ]),
  ],
  controllers: [WechatOauthController, CaptchaController],
  providers: [AdminManager, CaptchaService],
  exports: [],
})
export class CommModule {}
