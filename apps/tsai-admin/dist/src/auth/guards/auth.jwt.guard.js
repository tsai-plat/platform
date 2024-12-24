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
var AuthJwtGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const core_2 = require("@tsai-platform/core");
let AuthJwtGuard = AuthJwtGuard_1 = class AuthJwtGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector, config) {
        super();
        this.reflector = reflector;
        this.config = config;
        this.logger = new common_1.Logger(AuthJwtGuard_1.name);
    }
    canActivate(context) {
        if (this.config.get('STAGE', 'prod') === 'dev')
            return true;
        const isPublic = this.reflector.getAllAndOverride(core_2.PublicApiPropertyName, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        return super.canActivate(context);
    }
};
exports.AuthJwtGuard = AuthJwtGuard;
exports.AuthJwtGuard = AuthJwtGuard = AuthJwtGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService])
], AuthJwtGuard);
//# sourceMappingURL=auth.jwt.guard.js.map