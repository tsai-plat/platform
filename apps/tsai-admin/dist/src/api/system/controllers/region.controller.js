"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@tsailab/common");
const system_1 = require("@tsailab/system");
const api_routes_1 = require("../../api.routes");
let RegionController = class RegionController {
    constructor(regionService) {
        this.regionService = regionService;
    }
    getAllRegionTreeNodes(rootid) {
        return this.regionService.loadAllNodes(rootid);
    }
    getRegionTreeNodeAsync(rootid) {
        return this.regionService.levelRegionTreeNodes(rootid);
    }
    async getRegionModelDetail(id) {
        const model = await this.regionService.getRegionModel(id);
        if (!model)
            throw common_2.BizException.createError(common_2.ErrorCodeEnum.DATA_RECORD_REMOVED, `该行政区划不存在,请刷新后再试!`);
        return model;
    }
    async updateRegionModelSome(some) {
        const { id } = some;
        if (!id || id <= 0)
            throw common_2.BizException.createError(common_2.ErrorCodeEnum.DATA_RECORD_REMOVED, `该行政区划ID不存在,请刷新后再试!`);
        return await this.regionService.updateRegionSome(some);
    }
    setRegionSortno(dto) {
        return this.regionService.updateSortno(dto);
    }
    setRegionStatus(dto) {
        return this.regionService.updateStatus(dto);
    }
    querySubListRegions(queryDto) {
        return this.regionService.querySubList(queryDto);
    }
};
exports.RegionController = RegionController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '同步获取地区树',
    }),
    (0, common_1.Get)('sync_tree/:rootid'),
    __param(0, (0, common_1.Param)('rootid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RegionController.prototype, "getAllRegionTreeNodes", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '异步获取地区树节点',
    }),
    (0, common_1.Get)('async_treenode/:rootid'),
    __param(0, (0, common_1.Param)('rootid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RegionController.prototype, "getRegionTreeNodeAsync", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '查询行政区划详细信息',
    }),
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "getRegionModelDetail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '更新行政区划信息',
    }),
    (0, common_1.Post)('update_region'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "updateRegionModelSome", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '更新行政区划顺序码',
    }),
    (0, common_1.Post)('set_sortno'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.UpdateSortnoModel]),
    __metadata("design:returntype", void 0)
], RegionController.prototype, "setRegionSortno", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '设置行政区划顺启用状态',
    }),
    (0, common_1.Post)('set_status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.UpdateStatusModel]),
    __metadata("design:returntype", void 0)
], RegionController.prototype, "setRegionStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '查询下级行政区划列表',
    }),
    (0, common_1.Get)('query_sub_regions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.QuerySubRegionOptionModel]),
    __metadata("design:returntype", void 0)
], RegionController.prototype, "querySubListRegions", null);
exports.RegionController = RegionController = __decorate([
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.desc}: 行政区划`),
    (0, common_1.Controller)('region'),
    __metadata("design:paramtypes", [system_1.RegionService])
], RegionController);
//# sourceMappingURL=region.controller.js.map