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
exports.NextNoManager = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const common_2 = require("@tsailab/common");
const system_1 = require("@tsailab/system");
let NextNoManager = class NextNoManager {
    constructor(config, nextnoService) {
        this.config = config;
        this.nextnoService = nextnoService;
        this.seeds = [];
        const conf = config.get('system.unoSeeds', null);
        if (conf && Array.isArray(conf)) {
            let unoSeeds = conf;
            unoSeeds = unoSeeds
                .filter((v) => /[\d]{1,4}/.test(v))
                .map((v) => `000${v}`.slice(-4));
            this.seeds = [...unoSeeds];
        }
    }
    async batchInitNextnos(size, biztype, locked) {
        if (size <= 0)
            throw common_2.BizException.IllegalParamterError(`init size volume required more than zero.`);
        const maxno = await this.nextnoService.initicalizeNextBatchNos(biztype, size, locked);
        return {
            currentMaxNo: maxno,
            size,
            biztype,
        };
    }
    async getNextno(biztype) {
        const next = await this.nextnoService.getEnableNextNo(biztype);
        const unoInfo = common_2.RandomHelper.buildUno(next, this.seeds);
        return {
            nextno: next,
            unoInfo: unoInfo,
        };
    }
};
exports.NextNoManager = NextNoManager;
exports.NextNoManager = NextNoManager = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        system_1.NextNoService])
], NextNoManager);
//# sourceMappingURL=next-no.manager.js.map