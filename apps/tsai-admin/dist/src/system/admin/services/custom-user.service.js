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
exports.CustomUserService = void 0;
const common_1 = require("@nestjs/common");
const ucenter_1 = require("@tsai-platform/ucenter");
let CustomUserService = class CustomUserService {
    constructor(userService) {
        this.userService = userService;
    }
    getCustomUserByUno(userno) {
        return this.userService.getByUserno(userno);
    }
};
exports.CustomUserService = CustomUserService;
exports.CustomUserService = CustomUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ucenter_1.UserService])
], CustomUserService);
//# sourceMappingURL=custom-user.service.js.map