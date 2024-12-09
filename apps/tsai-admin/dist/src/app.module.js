"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const core_1 = require("@tsai-platform/core");
const typeorm_1 = require("@nestjs/typeorm");
const core_2 = require("@nestjs/core");
const node_redis_1 = require("@tsailab/node-redis");
const comm_module_1 = require("./common/comm.module");
const api_module_1 = require("./api/api.module");
const app_core_module_1 = require("./appcore/app-core.module");
const ucenter_1 = require("@tsai-platform/ucenter");
const system_1 = require("@tsailab/system");
let AppModule = class AppModule {
    configure(_consumer) { }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                cache: (0, core_1.isProdRuntime)(),
                isGlobal: true,
                load: [core_1.YamlConfigLoader],
                validationOptions: {
                    allowUnknow: true,
                    abortEarly: true,
                },
            }),
            node_redis_1.NodeRedisModule.forRoot({
                config: {
                    host: '172.20.0.1',
                    port: 6379,
                    db: 8,
                    ttl: 5,
                    password: 'admin123',
                },
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: core_1.MysqlConfigFactory,
            }),
            ucenter_1.UcenterModule.forRoot({ isGlobal: true }),
            system_1.SystemModule.forRoot(true),
            app_core_module_1.AppCoreModule,
            api_module_1.ApiModule,
            comm_module_1.CommModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_2.APP_INTERCEPTOR,
                useClass: core_1.ApiTransformInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map