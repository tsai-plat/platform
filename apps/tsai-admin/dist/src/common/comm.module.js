"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommModule = void 0;
const common_1 = require("@nestjs/common");
const wechat_oauth_controller_1 = require("./auth/wechat-oauth.controller");
const captcha_controller_1 = require("./captcha/captcha.controller");
const core_1 = require("@nestjs/core");
const services_1 = require("./services");
const core_2 = require("@tsai-platform/core");
let CommModule = class CommModule {
};
exports.CommModule = CommModule;
exports.CommModule = CommModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            core_1.RouterModule.register([
                {
                    path: 'comm',
                    module: CommModule,
                },
            ]),
        ],
        controllers: [wechat_oauth_controller_1.WechatOauthController, captcha_controller_1.CaptchaController],
        providers: [services_1.AdminManager, core_2.CaptchaService],
        exports: [],
    })
], CommModule);
//# sourceMappingURL=comm.module.js.map