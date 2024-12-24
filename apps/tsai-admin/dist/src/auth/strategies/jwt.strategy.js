"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_constants_1 = require("../auth.constants");
class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(config, authHelper) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader(auth_constants_1.SYSTEM_TOKEN_HEADER),
            ignoreExpiration: true,
            secretOrKey: config.get(`${auth_constants_1.JWT_YAML_CONF_KEY}.secretKey`, null),
        });
        this.config = config;
        this.authHelper = authHelper;
        this.logger = new common_1.Logger(JwtStrategy.name);
    }
    async validate(payload) {
        const { id, clit, acctype } = payload;
        const cache = await this.authHelper.checkTokenExists(id, clit, acctype);
        if (!cache)
            return null;
        const { token: _, ...user } = cache;
        return { ...user };
    }
}
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map