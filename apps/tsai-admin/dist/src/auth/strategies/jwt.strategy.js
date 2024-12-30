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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_constants_1 = require("../auth.constants");
const auth_helper_1 = require("../services/auth.helper");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(config, authHelper) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.get(`${auth_constants_1.JWT_YAML_CONF_KEY}.secretKey`, null),
        });
        this.config = config;
        this.authHelper = authHelper;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
        this.singleton = config.get(`${auth_constants_1.JWT_YAML_CONF_KEY}.singleton`, false);
    }
    async validate(payload, done) {
        const { id, clit, acctype, jti } = payload;
        const cache = await this.authHelper.checkTokenExists(id, clit, acctype);
        if (!cache)
            return done(new common_1.UnauthorizedException(`登录已失效!`), null);
        const { token, ...user } = cache;
        if (this.singleton) {
            const dePayload = await this.authHelper.decryptToken(token);
            if (dePayload?.jti !== jti)
                return done(new common_1.UnauthorizedException(`当前账号已在其他客户端登录!`));
        }
        return done(null, { ...user });
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_helper_1.AuthHelper])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map