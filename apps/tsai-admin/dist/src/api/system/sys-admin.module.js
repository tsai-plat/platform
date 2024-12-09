"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysAdminModule = void 0;
const common_1 = require("@nestjs/common");
const dict_controller_1 = require("./dict/dict.controller");
const dict_manager_service_1 = require("./dict/dict-manager.service");
const suser_controller_1 = require("./controllers/suser.controller");
const services_1 = require("./services");
const next_no_controller_1 = require("./controllers/next-no.controller");
let SysAdminModule = class SysAdminModule {
};
exports.SysAdminModule = SysAdminModule;
exports.SysAdminModule = SysAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [dict_controller_1.DictController, suser_controller_1.SuserController, next_no_controller_1.NextNoController],
        providers: [dict_manager_service_1.DictManagerService, services_1.SysUserManager, services_1.NextNoManager],
    })
], SysAdminModule);
//# sourceMappingURL=sys-admin.module.js.map