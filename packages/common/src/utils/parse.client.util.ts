import { ClientTypeEnum } from '@tsailab/core-types';

/**
 *
 * @param cliid
 * @returns
 */
export function parseClientType(cliid: string = ''): string {
  if (!cliid?.length) return cliid;
  if (cliid.startsWith(ClientTypeEnum.mobileChat))
    return ClientTypeEnum.mobileChat.valueOf();
  if (cliid.startsWith(ClientTypeEnum.mobileWxChat))
    return ClientTypeEnum.mobileWxChat.valueOf();
  if (cliid.startsWith(ClientTypeEnum.pcAgent))
    return ClientTypeEnum.pcAgent.valueOf();

  // system
  if (cliid.startsWith(ClientTypeEnum.system))
    return ClientTypeEnum.system.valueOf();
  if (cliid.startsWith(ClientTypeEnum.saAdmin))
    return ClientTypeEnum.saAdmin.valueOf();

  return '';
}
