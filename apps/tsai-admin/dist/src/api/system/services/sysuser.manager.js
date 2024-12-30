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
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const common_2 = require("@tsailab/common");
const typeorm_1 = require("typeorm");
const core_types_1 = require("@tsailab/core-types");
let SysUserManager = SysUserManager_1 = class SysUserManager {
    constructor(sysUserService, sysConfigService, config) {
        this.sysUserService = sysUserService;
        this.sysConfigService = sysConfigService;
        this.config = config;
        this.logger = new common_1.Logger(SysUserManager_1.name);
    }
    async queryList(dto, filterDeleted = true) {
        let qb = this.sysUserService.accRepository.createQueryBuilder('suser');
        const map = new Map();
        const { page = core_types_1.PageEnum.PAGE_NUMBER, pageSize = core_types_1.PageEnum.PAGE_SIZE, keywords, mobile, } = dto;
        if (mobile?.length) {
            map.set('phone', (0, typeorm_1.Like)(`%${mobile}%`));
        }
        qb = qb.where((0, common_2.mapToObj)(map));
        if (keywords?.length) {
            qb = qb.andWhere('suser.username LIKE :keywords OR suser.email LIKE :keywords OR suser.userno LIKE :keywords', {
                keywords: `%${keywords}%`,
            });
        }
        if (!filterDeleted) {
            qb = qb.withDeleted();
        }
        const [data, total] = await qb
            .orderBy('created_at', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return {
            page,
            pageSize,
            total,
            list: data ?? [],
        };
    }
    updateSystemUserStatus(dto) {
        const { id, status } = dto;
        return this.sysUserService.setUserStatus(id, status);
    }
    async resetSystemUserPassword(dto, user) {
        if (!user?.id || !user.isSuper) {
            throw common_2.BizException.createError(common_2.ErrorCodeEnum.USER_NO_PERMISSION, '您无权重置密码,请联系超级管理员!');
        }
        if (dto.id === user.id) {
            throw common_2.BizException.createError(common_2.ErrorCodeEnum.USER_NO_PERMISSION, '不能重置自己的密码');
        }
        const { id, password } = dto;
        const { affected } = await this.sysUserService.resetPassword(id, password);
        return affected > 0;
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
        system_1.SystemConfigService,
        config_1.ConfigService])
], SysUserManager);
//# sourceMappingURL=sysuser.manager.js.map