import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '@tsailab/system';
import { QuickRegisteredUser } from '../dto';
import { PlatformEnum, UserStatusEnum } from '@tsailab/core-types';
import { BizException, ErrorCodeEnum } from '@tsailab/common';

@Injectable()
export class CustomSigninManager {
  private logger = new Logger(CustomSigninManager.name);

  constructor(private readonly userService: UserService) {}
}
