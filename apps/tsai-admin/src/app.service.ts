import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@tsai-platform/ucenter';
import { formatDateTime } from '@tsailab/common';

@Injectable()
export class AppService {
  protected logger = new Logger(AppService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}
  health(): string {
    const name = this.config.get<string>('app.name', 'Tsai Application');
    this.userService.getById(1);
    return `${name} ${formatDateTime()}\<br\> Hey gay,I am running...!`;
  }
}
