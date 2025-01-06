import { MQChannelType } from '@tsailab/ioredis-mq';

export enum MQChannelEnum {
  SysLog = 'sys-log',
}

export const getAllChannels = () => {
  const channels: MQChannelType[] = [];
  for (const channel in MQChannelEnum) {
    channels.push(channel as MQChannelType);
  }

  return channels;
};
