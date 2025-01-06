import { PlatformEnum, UserStatusEnum } from '@tsailab/core-types';

export class QuickRegisteredModel {
  account: string; // email or phone
  nickname?: string;
  platform?: PlatformEnum;
  status?: UserStatusEnum;
}

export class CreateUsernamePasswordModel {
  username: string;
  phone: string;
  email: string;
  password: string;
  platform?: PlatformEnum;
  status?: UserStatusEnum;
  verifyCode: string;
}
