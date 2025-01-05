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
var SystemInitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemInitService = void 0;
const common_1 = require("@nestjs/common");
const system_1 = require("@tsailab/system");
let SystemInitService = SystemInitService_1 = class SystemInitService {
    constructor(organizationService, nextNoService, sysUserService) {
        this.organizationService = organizationService;
        this.nextNoService = nextNoService;
        this.sysUserService = sysUserService;
        this.logger = new common_1.Logger(SystemInitService_1.name);
    }
    onModuleInit() {
        this.initRootOrganization();
        this.initUserNos();
        this.initSupperAdminUser();
    }
    async initRootOrganization() {
        try {
            await this.organizationService.initRootNode();
            this.logger.log('Initialize root organization success');
        }
        catch (e) {
            this.logger.error(`Initialize root organization error,${e.message}`);
        }
    }
    async initUserNos() {
        try {
            const count = await this.nextNoService.autoInitBatchNosOnModuleInit(1, 1000);
            this.logger.log(`Initialize user no success ${count} records`);
        }
        catch (e) {
            this.logger.error(`Initialize user no error,${e.message}`);
        }
    }
    async initSupperAdminUser() {
        try {
            const result = await this.sysUserService.initSuperUser();
            this.logger.log(result);
        }
        catch (e) {
            this.logger.error(`Initialize root organization error,${e.message}`);
        }
    }
};
exports.SystemInitService = SystemInitService;
exports.SystemInitService = SystemInitService = SystemInitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [system_1.OrganizationService,
        system_1.NextNoService,
        system_1.SysUserService])
], SystemInitService);
//# sourceMappingURL=system-init.service.js.map