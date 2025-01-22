import { Injectable, Logger } from '@nestjs/common';
import { MQChannelEnum } from '@tsai-platform/core';
import { MQLogPayload } from '@tsailab/core-types';
import { MQMessageType, RedisMQService } from '@tsailab/ioredis-mq';
import { ClientLogService } from '@tsailab/system';

@Injectable()
export class ClientLogConsumner {
  protected logger = new Logger(ClientLogConsumner.name);

  constructor(
    private readonly mq: RedisMQService,
    private readonly clientlog: ClientLogService,
  ) {
    this.mq.registHandler(
      MQChannelEnum.customSign.toString(),
      this.receivedCustomSignHandler.bind(this),
    );
  }

  protected receivedCustomSignHandler(message: MQMessageType, channel: string) {
    switch (channel) {
      case 'custom-sign':
        this.handleClientMessageLog(message, channel);
        break;
      case 'chat-bot':
        this.logger.log(
          `Consumer received channel[${channel}] not handler.\n ${JSON.stringify(message, null, 2)}`,
        );
        break;
      case 'sys-log':
        this.logger.log(
          `Consumer received channel[${channel}] not handler.\n ${JSON.stringify(message, null, 2)}`,
        );
        break;
      default:
        this.logger.log(
          `Consumer received channel[${channel}] not handler.\n ${JSON.stringify(message, null, 2)}`,
        );
        break;
    }
  }

  private handleClientMessageLog(message: MQMessageType, channel: string) {
    try {
      const { payload } = message as MQMessageType<MQLogPayload>;
      this.clientlog.createClientLog(payload, channel);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
