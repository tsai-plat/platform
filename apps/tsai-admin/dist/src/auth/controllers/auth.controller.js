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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../dtos");
const auth_constants_1 = require("../auth.constants");
const core_1 = require("@tsai-platform/core");
const auth_service_1 = require("../services/auth.service");
const core_types_1 = require("@tsailab/core-types");
let AuthController = AuthController_1 = class AuthController {
    constructor(captcha, authService) {
        this.captcha = captcha;
        this.authService = authService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async login(req, dto) {
        const cookieValue = req.cookies[auth_constants_1.CaptchaCodeCookieKey];
        if (!dto?.isLock) {
            await this.captcha.validateCaptchaValue(dto?.code ?? '', cookieValue, core_types_1.PlatformEnum.SYSTEM_PLATFORM);
        }
        return await this.authService.login({ ...dto, cookieValue });
    }
    async getUserInfo(user) {
        return user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, core_1.PublicApi)(),
    (0, swagger_1.ApiOperation)({
        summary: '用戶名+密码登录',
        description: '用戶名+密码登录',
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.SigninLocalDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('userinfo'),
    __param(0, (0, core_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserInfo", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)('System Auth 模块'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [core_1.CaptchaService,
        auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map