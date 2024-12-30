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
var CaptchaController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@tsai-platform/core");
const common_2 = require("@tsailab/common");
const auth_constants_1 = require("../auth.constants");
const core_types_1 = require("@tsailab/core-types");
let CaptchaController = CaptchaController_1 = class CaptchaController {
    constructor(captchaService, config) {
        this.captchaService = captchaService;
        this.config = config;
        this.logger = new common_1.Logger(CaptchaController_1.name);
    }
    async get(nonce, res) {
        if (!nonce?.length) {
            nonce = common_2.RandomHelper.genRandomCacheKey();
        }
        await this.setCaptchaCookie(res, nonce);
        const captcha = await this.captchaService.getCaptchaMath(nonce);
        res.type(core_types_1.HttpContentTypeEnum.svgXml);
        res.status(common_1.HttpStatus.OK);
        res.send(captcha);
    }
    async setCaptchaCookie(res, value) {
        const { secret, secure, ...others } = await this.config.get('cookie', auth_constants_1.defaultCookieOpts);
        const options = {
            ...others,
            secure: secure || !!secret,
        };
        await res.cookie(auth_constants_1.CaptchaCodeCookieKey, value, {
            ...options,
        });
    }
};
exports.CaptchaController = CaptchaController;
__decorate([
    (0, core_1.PublicApi)(),
    (0, swagger_1.ApiOperation)({
        summary: '获取验证图片',
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('nonce')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CaptchaController.prototype, "get", null);
exports.CaptchaController = CaptchaController = CaptchaController_1 = __decorate([
    (0, common_1.Controller)('captcha'),
    __metadata("design:paramtypes", [core_1.CaptchaService,
        config_1.ConfigService])
], CaptchaController);
//# sourceMappingURL=captcha.controller.js.map