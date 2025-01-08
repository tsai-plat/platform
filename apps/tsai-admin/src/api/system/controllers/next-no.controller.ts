import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';
import { NextNoManager } from '../services';
import { NextNoType } from '@tsailab/core-types';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc}: 系统管理员`)
@Controller('nextno')
export class NextNoController {
  constructor(private readonly manager: NextNoManager) {}

  @ApiOperation({ summary: '批量预置用户编号' })
  @Post('batch_init_unos')
  @HttpCode(HttpStatus.OK)
  initNextBatch(@Body('size') size: number) {
    return this.manager.batchInitNextnos(size);
  }

  @Get('get_nextno/:biztype')
  getNextno(@Param('biztype') biztype: NextNoType) {
    return this.manager.getNextno(biztype);
  }
}
