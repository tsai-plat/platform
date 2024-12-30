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
exports.DictController = void 0;
const common_1 = require("@nestjs/common");
const dict_manager_service_1 = require("./dict-manager.service");
const swagger_1 = require("@nestjs/swagger");
const api_routes_1 = require("../../api.routes");
const system_1 = require("@tsailab/system");
const common_2 = require("@tsailab/common");
let DictController = class DictController {
    constructor(manager, dictService) {
        this.manager = manager;
        this.dictService = dictService;
    }
    listDict(queryDto) {
        return this.dictService.queryDictList(queryDto);
    }
    createDictInfo(dict) {
        return this.dictService.createDict(dict);
    }
    updateDictInfo(dict) {
        return this.dictService.updateDictSome(dict);
    }
    listDictItems(queryDto) {
        return this.dictService.queryDictItems(queryDto);
    }
    setSortnoById(dto) {
        return this.dictService.updateDictSortno(dto);
    }
    createDictItem(dto) {
        return this.dictService.createDictItem(dto);
    }
    updateDictItemSome(dto) {
        return this.dictService.updateSomeDictItem(dto);
    }
    setItemSortnoById(dto) {
        return this.dictService.updateDictItemSortno(dto);
    }
    setDictItemStatus(dto) {
        return this.dictService.setDictItemStatus(dto);
    }
    setDictItemActivedStatus(dto) {
        return this.dictService.setDictItemDefaultActived(dto);
    }
    getDictItemSelections(dictCode) {
        return this.dictService.getDictSelectionOptions(dictCode);
    }
};
exports.DictController = DictController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取数据字典列表' }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.QueryOptionsDto]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "listDict", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '创建字典' }),
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.SysDictBaseModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "createDictInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '修改字典' }),
    (0, common_1.Post)('update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.SysDictModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "updateDictInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取数据字典列表' }),
    (0, common_1.Get)('item/list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.QueryDictItemModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "listDictItems", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '设置字典顺序' }),
    (0, common_1.Post)('set_sortno'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.UpdateSortnoModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "setSortnoById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '新建字典项' }),
    (0, common_1.Post)('item/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.SysDictItemBaseModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "createDictItem", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '更新字典项' }),
    (0, common_1.Post)('item/update_some'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.SysDictItemModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "updateDictItemSome", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '设置字典顺序' }),
    (0, common_1.Post)('item/set_sortno'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.UpdateSortnoModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "setItemSortnoById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '设置设置字典项可用状态' }),
    (0, common_1.Post)('item/set_status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.UpdateStatusModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "setDictItemStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '设置设置字典项默认激活状态' }),
    (0, common_1.Post)('item/set_default_actived'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_1.DictItemDefaultActivedModel]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "setDictItemActivedStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取Dict select list' }),
    (0, common_1.Get)('item/get_selections'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DictController.prototype, "getDictItemSelections", null);
exports.DictController = DictController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)(`${api_routes_1.TsaiAdminModuleRoutes.systemRoute.name}: 数据字典`),
    (0, common_1.Controller)('dict'),
    __metadata("design:paramtypes", [dict_manager_service_1.DictManagerService,
        system_1.DictService])
], DictController);
//# sourceMappingURL=dict.controller.js.map