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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryAccountSelectionParams = exports.QueryAdminUserReqDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@tsailab/common");
class QueryAdminUserReqDto extends common_1.QueryOptionsDto {
}
exports.QueryAdminUserReqDto = QueryAdminUserReqDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: '查询条件:用户名或昵称' }),
    __metadata("design:type", String)
], QueryAdminUserReqDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: '查询条件:用户手机号码，支持模糊查询',
    }),
    __metadata("design:type", String)
], QueryAdminUserReqDto.prototype, "mobile", void 0);
class QueryAccountSelectionParams {
}
exports.QueryAccountSelectionParams = QueryAccountSelectionParams;
//# sourceMappingURL=sysuser.dto.js.map