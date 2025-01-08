import { Module } from '@nestjs/common';
import { CaptchaService } from './core/services/captcha/captcha.service';
import { ClientConfigService } from './core/services/client/client-config.service';

@Module({
  providers: [CaptchaService, ClientConfigService],
  exports: [CaptchaService],
})
export class CoreModule {}
