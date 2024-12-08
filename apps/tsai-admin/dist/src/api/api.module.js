"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const sys_admin_module_1 = require("./system/sys-admin.module");
const core_1 = require("@nestjs/core");
const api_routes_1 = require("./api.routes");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_1.RouterModule.register([
                {
                    path: api_routes_1.TsaiAdminModuleRoutes.systemRoute.modulePath,
                    module: sys_admin_module_1.SysAdminModule,
                },
            ]),
            sys_admin_module_1.SysAdminModule,
        ],
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map