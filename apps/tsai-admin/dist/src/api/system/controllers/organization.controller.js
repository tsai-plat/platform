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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@tsailab/common");
const core_types_1 = require("@tsailab/core-types");
const system_1 = require("@tsailab/system");
const api_routes_1 = require("../../api.routes");
let OrganizationController = class OrganizationController {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    treeList(rootId) {
        return this.organizationService.getOrganizationTreeNodes(rootId);
    }
    getOrganization(id) {
        return this.organizationService.getById(id);
    }
    updateOrganizationStatus(dto) {
        return this.organizationService.updateStatus(dto);
    }
    updateOrganizationById(dto) {
        return this.organizationService.updateOrganization(dto);
    }
    moveOrganizationSortno(id, moveType) {
        if (moveType === core_types_1.SortnoMoveEnum.MOVE_UP) {
            return this.organizationService.moveUpRecord(id);
        }
        if (moveType === core_types_1.SortnoMoveEnum.MOVE_DOWN) {
            return this.organizationService.moveDownRecord(id);
        }
        throw common_2.BizException.createError(common_2.ErrorCodeEnum.ILLEGAL_ARGS, `非法请求`);
    }
    addOrganizationInfo(dto) {
        return this.organizationService.addOrganization(dto);
    }
    getLevelTreeList(pid) {
        return this.organizationService.getLevelTreeNodesByPid(pid);
    }
    getSelectionNodes(pid) {
        return this.organizationService.getSelectionTreeNodesByPid(pid ?? -1);
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '组织树', description: '查询组织树' }),
    (0, common_1.Get)('tree/:rootId'),
    __param(0, (0, common_1.Param)('rootId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "treeList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取组织', description: '通过组织Id获取组织信息' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "getOrganization", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '更新组织状态', description: '更新组织状态' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('set_status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "updateOrganizationStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '更新组织', description: '更新组织' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.UpdateOrganizationModel]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "updateOrganizationById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '移动组织', description: '移动组织顺序' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('move/:id/:moveType'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('moveType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "moveOrganizationSortno", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '添加组织', description: '添加组织信息' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.AddOrganizationModel]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "addOrganizationInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '单级组织树', description: '查询单级组织树' }),
    (0, common_1.Get)('tree_level/:pid'),
    __param(0, (0, common_1.Param)('pid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "getLevelTreeList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '组织机构选择树', description: '查询All组织树' }),
    (0, common_1.Get)('tree_selections/:pid'),
    __param(0, (0, common_1.Param)('pid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "getSelectionNodes", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.desc} - Organization`),
    (0, common_1.Controller)('organization'),
    __metadata("design:paramtypes", [system_1.OrganizationService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map