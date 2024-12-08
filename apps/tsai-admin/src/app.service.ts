import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { formatDateTime } from '@tsailab/common';

@Injectable()
export class AppService {
  protected logger = new Logger(AppService.name);
  constructor(private readonly config: ConfigService) {}
  health(): string {
    const name = this.config.get<string>('app.name', 'Tsai Application');

    return `${name} ${formatDateTime()}\<br\> Hey gay,I am running...!`;
  }
}
