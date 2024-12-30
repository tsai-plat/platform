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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const system_1 = require("@tsailab/system");
const api_routes_1 = require("../../api.routes");
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    queryList(queryParams) {
        return this.roleService.queryList(queryParams);
    }
    createRole(dto) {
        return this.roleService.addRole(dto);
    }
    updateRole(dto) {
        return this.roleService.updateRole(dto);
    }
    setDefault(id) {
        return this.roleService.setDefault(id);
    }
    updateRoleStatus(data) {
        return this.roleService.setRoleStatus(data);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '查询角色列表' }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "queryList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '创建角色' }),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "createRole", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '更新角色' }),
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.BaseRoleModel]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "updateRole", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '设为默认' }),
    (0, common_1.Post)('set_default/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "setDefault", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '设置状态' }),
    (0, common_1.Post)('set_status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "updateRoleStatus", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.desc}: 角色`),
    (0, common_1.Controller)('role'),
    __metadata("design:paramtypes", [system_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map