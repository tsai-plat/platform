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
let SuserController = class SuserController {
    constructor(sysManager) {
        this.sysManager = sysManager;
    }
    list(queryDto) {
        return this.sysManager.queryList(queryDto);
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
exports.SuserController = SuserController = __decorate([
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.desc}: 系统管理员`),
    (0, common_1.Controller)('suser'),
    __metadata("design:paramtypes", [services_1.SysUserManager])
], SuserController);
//# sourceMappingURL=suser.controller.js.map