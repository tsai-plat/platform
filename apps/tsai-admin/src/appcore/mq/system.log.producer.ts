import { Injectable, Logger } from '@nestjs/common';
import { RedisMQService } from '@tsailab/ioredis-mq';

@Injectable()
export class SyslogMQProducer {
  private logger = new Logger(SyslogMQProducer.name);

  constructor(private readonly mq: RedisMQService) {}
}
