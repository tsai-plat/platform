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
var AuthHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHelper = void 0;
const config_1 = require("@nestjs/config");
const auth_constants_1 = require("../auth.constants");
const common_1 = require("@tsailab/common");
const ioredis_mq_1 = require("@tsailab/ioredis-mq");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
let AuthHelper = AuthHelper_1 = class AuthHelper {
    constructor(config, redis, jwt) {
        this.config = config;
        this.redis = redis;
        this.jwt = jwt;
        this.logger = new common_2.Logger(AuthHelper_1.name);
        const opts = this.config.get(auth_constants_1.JWT_YAML_CONF_KEY);
        if (!opts || !opts.secretKey?.length) {
            throw common_1.BizException.ConfigurationError(`JWT configuration loading error.`);
        }
        this.jwtOptions = { ...auth_constants_1.defaultJwtOpts, ...opts };
    }
    async createAccessToken(user, state = common_1.RandomHelper.randomState()) {
        const key = await this.getTokenKey(user.id, user.clit, user.acctype);
        const payload = await this.buildAccessPayload(user, state);
        const token = await this.jwt.sign(payload);
        const cache = {
            ...user,
            token,
        };
        await this.redis.setData(key, cache, this.expireinSeconds);
        return token;
    }
    get encrptRounds() {
        return this.jwtOptions?.encrptRounds ?? 10;
    }
    async checkTokenExists(id, clit = '_', acctype) {
        const key = await this.getTokenKey(id, clit, acctype);
        const cache = await this.redis.getData(key);
        return cache ? cache : null;
    }
    async renewToken(token) {
        const payload = await this.decryptToken(token);
        if (!payload)
            throw common_1.BizException.createError(common_1.ErrorCodeEnum.UNAUTHORIZED, `当前 Token 已失效,请重新登录!`);
        const { id, acctype, clit } = payload;
        const key = await this.getTokenKey(id, clit, acctype);
        const cache = await this.redis.getData(key);
        if (!cache)
            throw common_1.BizException.createError(common_1.ErrorCodeEnum.UNAUTHORIZED, `当前 Token 已失效,请重新登录!`);
        await this.redis.setExpires(key, this.expireinSeconds);
        const { token: _tk, ...user } = cache;
        return { ...user };
    }
    async encryptPassword(password) {
        return common_1.BcryptHelper.encryptPassword(password);
    }
    async comparePassword(password = '', encrypted = '') {
        return await common_1.BcryptHelper.validPassword(password, encrypted);
    }
    async buildAccessPayload(user, state) {
        const { id, username, userno, acctype, avatar } = user;
        const { version } = this.jwtOptions;
        const jti = await common_1.UuidGenerator.createJti();
        const payload = {
            version,
            jti,
            id,
            aud: acctype,
            username,
            cid: userno,
            acctype,
            avatar,
            nonce: state ?? common_1.RandomHelper.randomState(),
        };
        return payload;
    }
    getTokenKey(id, clit = '_', acctype) {
        return common_1.CacheKeyHelper.buildAccessTokenKey(id, clit, acctype);
    }
    async decryptToken(token) {
        return await this.jwt.decode(token);
    }
    get expireinSeconds() {
        const { expirein } = this.jwtOptions;
        return (0, common_1.convertDurationVolumeToSeconds)(expirein);
    }
};
exports.AuthHelper = AuthHelper;
exports.AuthHelper = AuthHelper = AuthHelper_1 = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        ioredis_mq_1.RedisService,
        jwt_1.JwtService])
], AuthHelper);
//# sourceMappingURL=auth.helper.js.map