import { Controller, Get, Query } from '@nestjs/common';
import { CustomManager } from '../services/custom.manager';
import { QueryCustomDto } from '../dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc}: 客户管理`)
@Controller('custom')
export class CustomController {
  constructor(private readonly userManager: CustomManager) {}

  @ApiOperation({
    summary: '查询终端用户列表',
  })
  @Get('list')
  querylist(@Query() queryDto: QueryCustomDto) {
    return this.userManager.querylist(queryDto);
  }
}
