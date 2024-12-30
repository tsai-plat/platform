import { Injectable, Logger } from '@nestjs/common';
import { ROOT_APP_NAME } from '../auth.constants';
import { SigninLocalDto } from '../dtos';
import { AuthHelper } from './auth.helper';
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import { SysUserService } from '@tsailab/system';
import { IUser } from '@tsailab/core-types';

@Injectable()
export class AuthService {
  protected logger = new Logger(`${ROOT_APP_NAME}-${AuthService.name}`);

  constructor(
    private readonly authHelper: AuthHelper,
    private readonly sysUserService: SysUserService,
  ) {}

  /**
   *
   * @param dto
   * @returns
   */
  async login(dto: SigninLocalDto) {
    const { account, password, cookieValue } = dto;

    const sysUser = await this.sysUserService.findUserByAccount(account);
    if (!sysUser)
      throw BizException.createError(ErrorCodeEnum.UNAUTHORIZED, `用户不存在`);

    if (!(await this.authHelper.comparePassword(password, sysUser.password))) {
      throw BizException.createError(ErrorCodeEnum.UNAUTHORIZED, `密码错误`);
    }
    const user: IUser = SysUserService.convertToUser(sysUser);

    const token = await this.authHelper.createAccessToken(user, cookieValue);
    return {
      token,
      userinfo: user,
    };
  }
}
