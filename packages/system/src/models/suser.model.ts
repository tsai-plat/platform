import { PlatformEnum } from '@tsailab/common';

export class CreateSUserModel {
  phone: string; // uni
  email: string; // uni
  username?: string;
  nickname?: string;
  password: string;
  verifyCode: string;
  avatar?: string;
  isSuper?: boolean;
  platform?: PlatformEnum;
  openid?: string;
  orgno?: string;
}
