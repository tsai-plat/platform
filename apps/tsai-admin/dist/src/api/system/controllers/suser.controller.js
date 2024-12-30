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
exports.SuserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_routes_1 = require("../../api.routes");
const services_1 = require("../services");
const dtos_1 = require("../dtos");
const suser_model_1 = require("@tsailab/system/dist/models/suser.model");
const core_1 = require("@tsai-platform/core");
const common_2 = require("@tsailab/common");
let SuserController = class SuserController {
    constructor(sysManager) {
        this.sysManager = sysManager;
    }
    list(queryDto) {
        return this.sysManager.queryList(queryDto);
    }
    addSystemUser(user) {
        return this.sysManager.createSystemUser(user);
    }
    resetOtherPassword(dto, user) {
        return this.sysManager.resetSystemUserPassword(dto, user);
    }
    updateStatus(dto, user) {
        if (dto.id === user.id) {
            throw common_2.BizException.createError(common_2.ErrorCodeEnum.USER_NO_PERMISSION, '不能修改自己的状态');
        }
        return this.sysManager.updateSystemUserStatus(dto);
    }
};
exports.SuserController = SuserController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取管理员账号列表' }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.QueryAdminUserReqDto]),
    __metadata("design:returntype", void 0)
], SuserController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '添加用户' }),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [suser_model_1.CreateSUserModel]),
    __metadata("design:returntype", void 0)
], SuserController.prototype, "addSystemUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '重置密码' }),
    (0, common_1.Post)('resetpwd'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, core_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ResetSysUserPwdDto, Object]),
    __metadata("design:returntype", void 0)
], SuserController.prototype, "resetOtherPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '重置状态' }),
    (0, common_1.Post)('update_status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, core_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.UpdateUserStatusModel, Object]),
    __metadata("design:returntype", void 0)
], SuserController.prototype, "updateStatus", null);
exports.SuserController = SuserController = __decorate([
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.desc}: 系统管理员`),
    (0, common_1.Controller)('suser'),
    __metadata("design:paramtypes", [services_1.SysUserManager])
], SuserController);
//# sourceMappingURL=suser.controller.js.map