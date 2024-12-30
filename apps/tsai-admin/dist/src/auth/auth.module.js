"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controllers/auth.controller");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_constants_1 = require("./auth.constants");
const core_1 = require("@nestjs/core");
const captcha_controller_1 = require("./controllers/captcha.controller");
const core_2 = require("@tsai-platform/core");
const auth_helper_1 = require("./services/auth.helper");
const auth_service_1 = require("./services/auth.service");
const auth_jwt_guard_1 = require("./guards/auth.jwt.guard");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            core_1.RouterModule.register([
                {
                    path: 'auth',
                    module: AuthModule,
                },
            ]),
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                property: 'user',
                session: true,
            }),
            jwt_1.JwtModule.registerAsync({
                useFactory: (config) => ({
                    secret: config.get(`${auth_constants_1.JWT_YAML_CONF_KEY}.secretKey`),
                    signOptions: {
                        issuer: config.get(`${auth_constants_1.JWT_YAML_CONF_KEY}.iss`, 'tsailab'),
                        subject: config.get(`${auth_constants_1.JWT_YAML_CONF_KEY}.sub`, 'ts-admin'),
                    },
                    verifyOptions: {
                        ignoreExpiration: true,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController, captcha_controller_1.CaptchaController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_jwt_guard_1.AuthJwtGuard,
            },
            jwt_strategy_1.JwtStrategy,
            auth_helper_1.AuthHelper,
            core_2.CaptchaService,
            auth_service_1.AuthService,
        ],
        exports: [],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map