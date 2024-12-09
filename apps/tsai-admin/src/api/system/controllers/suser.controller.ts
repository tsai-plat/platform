import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';
import { SysUserManager } from '../services';
import { QueryAdminUserReqDto } from '../dtos';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc}: 系统管理员`)
@Controller('suser')
export class SuserController {
  constructor(private readonly sysManager: SysUserManager) {}

  @ApiOperation({ summary: '获取管理员账号列表' })
  @Get('list')
  list(@Query() queryDto: QueryAdminUserReqDto) {
    return this.sysManager.queryList(queryDto);
  }
}
