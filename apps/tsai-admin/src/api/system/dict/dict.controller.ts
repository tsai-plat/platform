import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { DictManagerService } from './dict-manager.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';
import {
  DictItemDefaultActivedModel,
  DictService,
  QueryDictItemModel,
  SysDictBaseModel,
  SysDictItemBaseModel,
  SysDictItemModel,
  SysDictModel,
} from '@tsailab/system';
import {
  QueryOptionsDto,
  UpdateSortnoModel,
  UpdateStatusModel,
} from '@tsailab/common';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.name}: 数据字典`)
@Controller('dict')
export class DictController {
  constructor(
    private readonly manager: DictManagerService,
    private readonly dictService: DictService,
  ) {}

  @ApiOperation({ summary: '获取数据字典列表' })
  @Get('list')
  listDict(@Query() queryDto: QueryOptionsDto) {
    return this.dictService.queryDictList(queryDto);
  }

  @ApiOperation({ summary: '创建字典' })
  @Post('create')
  @HttpCode(HttpStatus.OK)
  createDictInfo(@Body() dict: SysDictBaseModel) {
    return this.dictService.createDict(dict);
  }

  @ApiOperation({ summary: '修改字典' })
  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateDictInfo(@Body() dict: SysDictModel) {
    return this.dictService.updateDictSome(dict);
  }

  @ApiOperation({ summary: '获取数据字典列表' })
  @Get('item/list')
  listDictItems(@Query() queryDto: QueryDictItemModel) {
    return this.dictService.queryDictItems(queryDto);
  }

  @ApiOperation({ summary: '设置字典顺序' })
  @Post('set_sortno')
  @HttpCode(HttpStatus.OK)
  setSortnoById(@Body() dto: UpdateSortnoModel) {
    return this.dictService.updateDictSortno(dto);
  }

  @ApiOperation({ summary: '新建字典项' })
  @Post('item/create')
  @HttpCode(HttpStatus.OK)
  createDictItem(@Body() dto: SysDictItemBaseModel) {
    return this.dictService.createDictItem(dto);
  }

  @ApiOperation({ summary: '更新字典项' })
  @Post('item/update_some')
  @HttpCode(HttpStatus.OK)
  updateDictItemSome(@Body() dto: SysDictItemModel) {
    return this.dictService.updateSomeDictItem(dto);
  }

  @ApiOperation({ summary: '设置字典顺序' })
  @Post('item/set_sortno')
  @HttpCode(HttpStatus.OK)
  setItemSortnoById(@Body() dto: UpdateSortnoModel) {
    return this.dictService.updateDictItemSortno(dto);
  }

  @ApiOperation({ summary: '设置设置字典项可用状态' })
  @Post('item/set_status')
  @HttpCode(HttpStatus.OK)
  setDictItemStatus(@Body() dto: UpdateStatusModel) {
    return this.dictService.setDictItemStatus(dto);
  }

  @ApiOperation({ summary: '设置设置字典项默认激活状态' })
  @Post('item/set_default_actived')
  @HttpCode(HttpStatus.OK)
  setDictItemActivedStatus(@Body() dto: DictItemDefaultActivedModel) {
    return this.dictService.setDictItemDefaultActived(dto);
  }

  @ApiOperation({ summary: '获取Dict select list' })
  @Get('item/get_selections')
  @HttpCode(HttpStatus.OK)
  getDictItemSelections(@Query('code') dictCode: string) {
    return this.dictService.getDictSelectionOptions(dictCode);
  }
}
