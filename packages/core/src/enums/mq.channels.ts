export enum MQChannelEnum {
  customSign = 'custom-sign', // rgistered,signin ,signout
  chatbot = 'chat-bot',
  sysLog = 'sys-log',
}

export const allChannels = () => Object.values(MQChannelEnum);
