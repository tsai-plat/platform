import { SysUserService } from '@tsailab/system';
import { QueryAdminUserReqDto } from '../dtos';
import { UserService } from '@tsai-platform/ucenter';
import { Injectable, Logger } from '@nestjs/common';
import { CreateSUserModel } from '@tsailab/system/dist/models/suser.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SysUserManager {
  protected logger = new Logger(SysUserManager.name);
  constructor(
    private readonly sysUserService: SysUserService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
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

  async createSystemUser(dto: CreateSUserModel) {
    const pw = await this.config.get<string>(
      'system.defaultPassword',
      'Admin@tsai',
    );

    if (!dto.password?.length) {
      dto.password = pw;
    }
    return await this.sysUserService.createSuser(dto);
  }
}
