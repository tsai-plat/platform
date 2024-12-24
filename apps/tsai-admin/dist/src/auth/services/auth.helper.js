"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHelper = void 0;
const auth_constants_1 = require("../auth.constants");
const common_1 = require("@tsailab/common");
class AuthHelper {
    constructor(config, redis, jwt) {
        this.config = config;
        this.redis = redis;
        this.jwt = jwt;
        const opts = this.config.get(auth_constants_1.JWT_YAML_CONF_KEY);
        if (!opts || !opts.secretKey?.length) {
            throw common_1.BizException.ConfigurationError(`JWT configuration loading error.`);
        }
        this.jwtOptions = { ...auth_constants_1.defaultJwtOpts, ...opts };
    }
}
exports.AuthHelper = AuthHelper;
//# sourceMappingURL=auth.helper.js.map