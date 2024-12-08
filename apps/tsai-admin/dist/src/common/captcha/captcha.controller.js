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
exports.CaptchaController = void 0;
const common_1 = require("@nestjs/common");
const captcha_service_1 = require("./captcha.service");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@tsailab/common");
let CaptchaController = class CaptchaController {
    constructor(captchaService) {
        this.captchaService = captchaService;
    }
    async get(nonce, res) {
        if (!nonce?.length) {
            nonce = common_2.RandomHelper.genRandomCacheKey();
        }
        const captcha = await this.captchaService.getCaptchaMath(nonce);
        res.setHeader('Loto-Captch-Code', nonce);
        res.type(common_2.HttpContentTypeEnum.svgXml);
        res.status(common_1.HttpStatus.OK);
        res.send(captcha);
    }
};
exports.CaptchaController = CaptchaController;
__decorate([
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
exports.CaptchaController = CaptchaController = __decorate([
    (0, common_1.Controller)('captcha'),
    __metadata("design:paramtypes", [captcha_service_1.CaptchaService])
], CaptchaController);
//# sourceMappingURL=captcha.controller.js.map