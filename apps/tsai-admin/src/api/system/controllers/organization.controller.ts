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
import { BizException, ErrorCodeEnum } from '@tsailab/common';
import {
  ROOT_TRRE_NODE_PID,
  SetStatusData,
  SortnoMoveEnum,
} from '@tsailab/core-types';
import {
  AddOrganizationModel,
  OrganizationService,
  UpdateOrganizationModel,
} from '@tsailab/system';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';

@ApiTags(`${TsaiAdminModuleRoutes.systemRoute.desc} - Organization`)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: '组织树', description: '查询组织树' })
  @Get('tree/:rootId')
  treeList(@Param('rootId') rootId: number) {
    return this.organizationService.getOrganizationTreeNodes(rootId);
  }

  @ApiOperation({ summary: '获取组织', description: '通过组织Id获取组织信息' })
  @Get(':id')
  getOrganization(@Param('id') id: number) {
    return this.organizationService.getById(id);
  }

  @ApiOperation({ summary: '更新组织状态', description: '更新组织状态' })
  @HttpCode(HttpStatus.OK)
  @Post('set_status')
  updateOrganizationStatus(@Body() dto: SetStatusData) {
    return this.organizationService.updateStatus(dto);
  }

  @ApiOperation({ summary: '更新组织', description: '更新组织' })
  @HttpCode(HttpStatus.OK)
  @Post('update')
  updateOrganizationById(@Body() dto: UpdateOrganizationModel) {
    return this.organizationService.updateOrganization(dto);
  }

  @ApiOperation({ summary: '移动组织', description: '移动组织顺序' })
  @HttpCode(HttpStatus.OK)
  @Post('move/:id/:moveType')
  moveOrganizationSortno(
    @Param('id') id: number,
    @Param('moveType') moveType: SortnoMoveEnum,
  ) {
    if (moveType === SortnoMoveEnum.MOVE_UP) {
      return this.organizationService.moveUpRecord(id);
    }
    if (moveType === SortnoMoveEnum.MOVE_DOWN) {
      return this.organizationService.moveDownRecord(id);
    }

    throw BizException.createError(ErrorCodeEnum.ILLEGAL_ARGS, `非法请求`);
  }

  @ApiOperation({ summary: '添加组织', description: '添加组织信息' })
  @HttpCode(HttpStatus.OK)
  @Post('create')
  addOrganizationInfo(@Body() dto: AddOrganizationModel) {
    return this.organizationService.addOrganization(dto);
  }

  @ApiOperation({ summary: '单级组织树', description: '查询单级组织树' })
  @Get('tree_level/:pid')
  getLevelTreeList(@Param('pid') pid?: number) {
    return this.organizationService.getLevelTreeNodesByPid(pid);
  }

  @ApiOperation({ summary: '组织机构选择树', description: '查询All组织树' })
  @Get('tree_selections/:pid')
  getSelectionNodes(@Param('pid') pid: number) {
    return this.organizationService.getSelectionTreeNodesByPid(pid ?? -1);
  }

  @ApiOperation({
    summary: '组织机构级联选择树',
    description: '查询All组织树 TreeNodeOptionType',
  })
  @Get('cascade_tree_nodes/:pid')
  getCascadeNodes(@Param('pid') pid: number) {
    return this.organizationService.getCommonTreeNodes(pid);
  }

  @ApiOperation({
    summary: '获取当前父节点下的next orgno',
    description: '获取当前父节点下的next orgno',
  })
  @Get('next_orgno/:pid')
  getNextOrgno(@Param('pid') pid: number = ROOT_TRRE_NODE_PID) {
    return this.organizationService.getNextOrgnoByPid(pid);
  }
}
