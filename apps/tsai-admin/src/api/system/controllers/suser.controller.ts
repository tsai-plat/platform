import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';
import { SysUserManager } from '../services';
import { QueryAdminUserReqDto, ResetSysUserPwdDto } from '../dtos';
import { CreateSUserModel } from '@tsailab/system/dist/models/suser.model';
import { CurrentUser } from '@tsai-platform/core';
import {
  BizException,
  ErrorCodeEnum,
  UpdateUserStatusModel,
} from '@tsailab/common';
import { IUser } from '@tsailab/core-types';

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
    return this.sysManager.updateSystemUserStatus(dto);
  }
}
