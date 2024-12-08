import { Module } from '@nestjs/common';
import { WechatOauthController } from './auth/wechat-oauth.controller';
import { CaptchaController } from './captcha/captcha.controller';
import { CaptchaService } from './captcha/captcha.service';

@Module({
  imports: [],
  controllers: [WechatOauthController, CaptchaController],
  providers: [CaptchaService],
  exports: [],
})
export class CommModule {}
