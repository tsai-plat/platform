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
import {
  BizException,
  ErrorCodeEnum,
  UpdateSortnoModel,
  UpdateStatusModel,
} from '@tsailab/common';
import {
  QuerySubRegionOptionModel,
  RegionModelType,
  RegionService,
} from '@tsailab/system';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc}: 行政区划`)
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @ApiOperation({
    summary: '同步获取地区树',
  })
  @Get('sync_tree/:rootid')
  getAllRegionTreeNodes(@Param('rootid') rootid: number) {
    return this.regionService.loadAllNodes(rootid);
  }

  @ApiOperation({
    summary: '异步获取地区树节点',
  })
  @Get('async_treenode/:rootid')
  getRegionTreeNodeAsync(@Param('rootid') rootid: number) {
    return this.regionService.levelRegionTreeNodes(rootid);
  }

  @ApiOperation({
    summary: '查询行政区划详细信息',
  })
  @Get('detail/:id')
  async getRegionModelDetail(@Param('id') id: number) {
    const model = await this.regionService.getRegionModel(id);
    if (!model)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `该行政区划不存在,请刷新后再试!`,
      );

    return model;
  }

  @ApiOperation({
    summary: '更新行政区划信息',
  })
  @Post('update_region')
  @HttpCode(HttpStatus.OK)
  async updateRegionModelSome(@Body() some: Partial<RegionModelType>) {
    const { id } = some;
    if (!id || id <= 0)
      throw BizException.createError(
        ErrorCodeEnum.DATA_RECORD_REMOVED,
        `该行政区划ID不存在,请刷新后再试!`,
      );

    return await this.regionService.updateRegionSome(some);
  }

  @ApiOperation({
    summary: '更新行政区划顺序码',
  })
  @Post('set_sortno')
  @HttpCode(HttpStatus.OK)
  setRegionSortno(@Body() dto: UpdateSortnoModel) {
    return this.regionService.updateSortno(dto);
  }

  @ApiOperation({
    summary: '设置行政区划顺启用状态',
  })
  @Post('set_status')
  @HttpCode(HttpStatus.OK)
  setRegionStatus(@Body() dto: UpdateStatusModel) {
    return this.regionService.updateStatus(dto);
  }

  @ApiOperation({
    summary: '查询下级行政区划列表',
  })
  @Get('query_sub_regions')
  querySubListRegions(@Query() queryDto: QuerySubRegionOptionModel) {
    return this.regionService.querySubList(queryDto);
  }
}
