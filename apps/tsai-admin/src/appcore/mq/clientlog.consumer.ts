import { Logger } from '@nestjs/common';
import { MQChannelEnum } from '@tsai-platform/core';
import { MQMessageType, RedisMQService } from '@tsailab/ioredis-mq';
import { ClientLogService } from '@tsailab/system';

export class ClientLogConsumner {
  protected logger = new Logger(ClientLogConsumner.name);

  constructor(
    private readonly mq: RedisMQService,
    private readonly clientlog: ClientLogService,
  ) {
    this.mq.registHandler(
      MQChannelEnum.customSign,
      this.receivedCustomSignHandler.bind(this),
    );
  }

  protected receivedCustomSignHandler(message: MQMessageType, channel: string) {
    this.logger.log(
      `Consumer received channel[${channel}] \n ${JSON.stringify(message, null, 2)}`,
    );
  }
}
