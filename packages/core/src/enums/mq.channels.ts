export enum MQChannelEnum {
  customSign = 'custom-sign', // rgistered,signin ,signout
  chatbot = 'chat-bot',
  sysLog = 'sys-log',
  uploadLog = 'upload-log',
}

export const allChannels = () => Object.values(MQChannelEnum);
