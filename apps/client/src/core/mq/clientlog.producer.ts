import { Injectable, Logger } from '@nestjs/common';
import { MQChannelEnum } from '@tsai-platform/core';
import { MQLogPayload } from '@tsailab/core-types';
import { MQMessageType, RedisMQService } from '@tsailab/ioredis-mq';

@Injectable()
export class ClientlogProducer {
  protected logger = new Logger(ClientlogProducer.name);

  constructor(private readonly mq: RedisMQService) {}

  async publishClientLog(
    data: MQLogPayload,
  ): Promise<MQMessageType<MQLogPayload> | never> {
    const message = await this.mq.publishMessage(
      data,
      MQChannelEnum.customSign,
    );

    return message;
  }
}
