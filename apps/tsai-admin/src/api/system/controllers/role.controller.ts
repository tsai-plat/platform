import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryPageParams, SetStatusData } from '@tsailab/core-types';

import { BaseRoleModel, CreateRoleModel, RoleService } from '@tsailab/system';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc}: 角色`)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '查询角色列表' })
  @Get('list')
  queryList(@Query() queryParams: QueryPageParams) {
    return this.roleService.queryList(queryParams);
  }
  @ApiOperation({ summary: '创建角色' })
  @Post('create')
  createRole(@Body() dto: CreateRoleModel) {
    return this.roleService.addRole(dto);
  }
  @ApiOperation({ summary: '更新角色' })
  @Post('update')
  updateRole(@Body() dto: BaseRoleModel) {
    return this.roleService.updateRole(dto);
  }

  @ApiOperation({ summary: '设为默认' })
  @Post('set_default/:id')
  @HttpCode(HttpStatus.OK)
  setDefault(@Param('id') id: number) {
    return this.roleService.setDefault(id);
  }

  @ApiOperation({ summary: '设置状态' })
  @Post('set_status')
  @HttpCode(HttpStatus.OK)
  updateRoleStatus(@Body() data: SetStatusData) {
    return this.roleService.setRoleStatus(data);
  }
}
