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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUserController = void 0;
const common_1 = require("@nestjs/common");
const custom_user_service_1 = require("../services/custom-user.service");
const swagger_1 = require("@nestjs/swagger");
let CustomUserController = class CustomUserController {
    constructor(customService) {
        this.customService = customService;
    }
    getByUserno(no) {
        return this.customService.getCustomUserByUno(no);
    }
};
exports.CustomUserController = CustomUserController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '查询用户信息',
    }),
    (0, common_1.Get)('by_uno/:no'),
    __param(0, (0, common_1.Param)('no')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomUserController.prototype, "getByUserno", null);
exports.CustomUserController = CustomUserController = __decorate([
    (0, swagger_1.ApiTags)(`客戶後臺管理`),
    (0, common_1.Controller)('custom/user'),
    __metadata("design:paramtypes", [typeof (_a = typeof custom_user_service_1.CustomUserService !== "undefined" && custom_user_service_1.CustomUserService) === "function" ? _a : Object])
], CustomUserController);
//# sourceMappingURL=custom-user.controller.js.map