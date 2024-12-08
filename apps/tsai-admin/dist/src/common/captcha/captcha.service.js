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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@tsailab/common");
const node_redis_1 = require("@tsailab/node-redis");
const svgCaptcha = require("svg-captcha-fixed");
let CaptchaService = class CaptchaService {
    constructor(redisSevice) {
        this.redisSevice = redisSevice;
        this.expires = 60;
    }
    async getCaptchaMath(nonce) {
        const k = common_2.CacheKeyHelper.buildCaptchaKey(nonce);
        const captcha = this.captchaMath();
        await this.redisSevice.setValueEx(k, captcha.text, this.expires);
        return captcha.data;
    }
    captchaMath() {
        const captcha = svgCaptcha.createMathExpr({
            mathMax: 35,
            mathMin: 1,
            mathOperator: '+-',
            fontSize: 50,
            width: 120,
            height: 36,
            background: '#cc9966',
        });
        return captcha;
    }
};
exports.CaptchaService = CaptchaService;
exports.CaptchaService = CaptchaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [node_redis_1.NodeRedisService])
], CaptchaService);
//# sourceMappingURL=captcha.service.js.map