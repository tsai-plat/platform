import { SysUserService } from '@tsailab/system';
import { QueryAdminUserReqDto } from '../dtos';
import { UserService } from '@tsai-platform/ucenter';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SysUserManager {
  protected logger = new Logger(SysUserManager.name);
  constructor(
    private readonly sysUserService: SysUserService,
    private readonly userService: UserService,
  ) {}

  async queryList(dto: QueryAdminUserReqDto, filterDeleted = true) {
    const r = await this.userService.getById(1);
    this.logger.log(r);
    // this.sysUserService.getById(1);
    return {
      ...dto,
      filterDeleted,
      r,
    };
  }
}
