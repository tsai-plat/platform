import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';
import { SysUserManager } from '../services';
import { QueryAdminUserReqDto, ResetSysUserPwdDto } from '../dtos';

import { CurrentUser } from '@tsai-platform/core';
import {
  BizException,
  ErrorCodeEnum,
  UpdateUserStatusModel,
} from '@tsailab/common';
import { IUser } from '@tsailab/core-types';
import { CreateSUserModel, UpdateSUserModel } from '@tsailab/system';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc}: 系统管理员`)
@Controller('suser')
export class SuserController {
  constructor(private readonly sysManager: SysUserManager) {}

  @ApiOperation({ summary: '获取管理员账号列表' })
  @Get('list')
  list(@Query() queryDto: QueryAdminUserReqDto) {
    return this.sysManager.queryList(queryDto);
  }

  @ApiOperation({ summary: '添加用户' })
  @Post('create')
  addSystemUser(@Body() user: CreateSUserModel) {
    return this.sysManager.createSystemUser(user);
  }

  @ApiOperation({ summary: '修改用户' })
  @Post('update_some')
  updateSystemUser(@Body() dto: UpdateSUserModel) {
    return this.sysManager.updateSystemUserSome(dto);
  }

  @ApiOperation({ summary: '重置密码' })
  @Post('resetpwd')
  resetOtherPassword(
    @Body() dto: ResetSysUserPwdDto,
    @CurrentUser() user: IUser,
  ) {
    return this.sysManager.resetSystemUserPassword(dto, user);
  }

  @ApiOperation({ summary: '重置状态' })
  @Post('update_status')
  updateStatus(@Body() dto: UpdateUserStatusModel, @CurrentUser() user: IUser) {
    if (dto.id === user.id) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        '不能修改自己的状态',
      );
    }
    if (!user?.isSuper) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        `只有超级管理员才能操作.`,
      );
    }
    return this.sysManager.updateSystemUserStatus(dto);
  }

  @ApiOperation({ summary: '设为超级管理员' })
  @Post('set_issuper/:id')
  setIsSuper(@Param('id') id: number, @CurrentUser() user: IUser) {
    if (!user?.isSuper) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        `只有超级管理员才能操作.`,
      );
    }
    return this.sysManager.setUserIsSuper(id, true);
  }

  @ApiOperation({ summary: '取消超级管理员' })
  @Post('cancel_issuper/:id')
  cancelIsSuper(@Param('id') id: number, @CurrentUser() user: IUser) {
    if (!user?.isSuper) {
      throw BizException.createError(
        ErrorCodeEnum.USER_NO_PERMISSION,
        `只有超级管理员才能操作.`,
      );
    }

    return this.sysManager.setUserIsSuper(id, false);
  }
}
