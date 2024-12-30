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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextNoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_routes_1 = require("../../api.routes");
const services_1 = require("../services");
const core_types_1 = require("@tsailab/core-types");
let NextNoController = class NextNoController {
    constructor(manager) {
        this.manager = manager;
    }
    initNextBatch(size) {
        return this.manager.batchInitNextnos(size, core_types_1.NextNoBiztype.USER.valueOf(), false);
    }
    getNextno(biztype) {
        return this.manager.getNextno(biztype);
    }
};
exports.NextNoController = NextNoController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '批量预置用户编号' }),
    (0, common_1.Post)('batch_init_unos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NextNoController.prototype, "initNextBatch", null);
__decorate([
    (0, common_1.Get)('get_nextno/:biztype'),
    __param(0, (0, common_1.Param)('biztype')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NextNoController.prototype, "getNextno", null);
exports.NextNoController = NextNoController = __decorate([
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.desc}: 系统管理员`),
    (0, common_1.Controller)('nextno'),
    __metadata("design:paramtypes", [services_1.NextNoManager])
], NextNoController);
//# sourceMappingURL=next-no.controller.js.map