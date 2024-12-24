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
exports.SigninLocalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SigninLocalDto {
}
exports.SigninLocalDto = SigninLocalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        name: 'account',
        description: 'login account: username,userno,phone or email',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SigninLocalDto.prototype, "account", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: 'password',
        required: true,
        description: `用户密码`,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SigninLocalDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: 'code',
        required: true,
        description: `验证码`,
    }),
    (0, class_validator_1.ValidateIf)((o) => !!o.isLock && !o?.code?.trim()?.length, {
        message: '请输入验证码',
    }),
    __metadata("design:type", String)
], SigninLocalDto.prototype, "code", void 0);
//# sourceMappingURL=signin.dto.js.map