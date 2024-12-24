"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultJwtOpts = exports.JWT_YAML_CONF_KEY = void 0;
exports.JWT_YAML_CONF_KEY = 'auth.jwt';
exports.defaultJwtOpts = {
    version: '1',
    iss: 'tsai',
    sub: 'tsai-api',
    expirein: 24 * 3600,
};
//# sourceMappingURL=auth.constants.js.map