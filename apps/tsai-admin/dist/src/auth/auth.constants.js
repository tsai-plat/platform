"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCookieOpts = exports.CaptchaCodeCookieKey = exports.defaultJwtOpts = exports.SYSTEM_TOKEN_HEADER = exports.JWT_YAML_CONF_KEY = exports.ROOT_APP_NAME = void 0;
exports.ROOT_APP_NAME = 'TsAdminAPI';
exports.JWT_YAML_CONF_KEY = 'auth.jwt';
exports.SYSTEM_TOKEN_HEADER = 'tk';
exports.defaultJwtOpts = {
    encrptRounds: 10,
    version: '1',
    iss: 'tsai',
    sub: 'tsai-api',
    expirein: 24 * 3600,
};
exports.CaptchaCodeCookieKey = 'captcha-code';
exports.defaultCookieOpts = {
    secret: 'tsai-admin',
    httpOnly: true,
    maxAge: 60 * 5 * 1000,
    secure: true,
    SameSite: 'Lax',
    path: '/v1/auth',
};
//# sourceMappingURL=auth.constants.js.map