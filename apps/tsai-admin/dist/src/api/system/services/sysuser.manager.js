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
var SysUserManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysUserManager = void 0;
const system_1 = require("@tsailab/system");
const ucenter_1 = require("@tsai-platform/ucenter");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SysUserManager = SysUserManager_1 = class SysUserManager {
    constructor(sysUserService, userService, config) {
        this.sysUserService = sysUserService;
        this.userService = userService;
        this.config = config;
        this.logger = new common_1.Logger(SysUserManager_1.name);
    }
    async queryList(dto, filterDeleted = true) {
        const r = await this.userService.getById(1);
        this.logger.log(r);
        return {
            ...dto,
            filterDeleted,
            r,
        };
    }
    async createSystemUser(dto) {
        const pw = await this.config.get('system.defaultPassword', 'Admin@tsai');
        if (!dto.password?.length) {
            dto.password = pw;
        }
        return await this.sysUserService.createSuser(dto);
    }
};
exports.SysUserManager = SysUserManager;
exports.SysUserManager = SysUserManager = SysUserManager_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [system_1.SysUserService,
        ucenter_1.UserService,
        config_1.ConfigService])
], SysUserManager);
//# sourceMappingURL=sysuser.manager.js.map