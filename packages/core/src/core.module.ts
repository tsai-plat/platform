import { Module } from '@nestjs/common';
import { CaptchaService } from './core/services/captcha/captcha.service';

@Module({
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CoreModule {}
