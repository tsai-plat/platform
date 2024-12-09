import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BizException, RandomHelper } from '@tsailab/common';
import { NextNoService } from '@tsailab/system';

@Injectable()
export class NextNoManager {
  private seeds: Array<any> = [];
  constructor(
    private readonly config: ConfigService,
    private readonly nextnoService: NextNoService,
  ) {
    const conf = config.get('system.unoSeeds', null);
    if (conf && Array.isArray(conf)) {
      let unoSeeds = conf as unknown as string[];
      unoSeeds = unoSeeds
        .filter((v) => /[\d]{1,4}/.test(v))
        .map((v) => `000${v}`.slice(-4));

      this.seeds = [...unoSeeds];
    }
  }

  async batchInitNextnos(size: number, biztype: number, locked?: boolean) {
    if (size <= 0)
      throw BizException.IllegalParamterError(
        `init size volume required more than zero.`,
      );
    const maxno = await this.nextnoService.initicalizeNextBatchNos(
      biztype,
      size,
      locked,
    );

    // reload cache

    return {
      currentMaxNo: maxno,
      size,
      biztype,
    };
  }

  async getNextno(biztype: number) {
    const next = await this.nextnoService.getEnableNextNo(biztype);

    const unoInfo = RandomHelper.buildUno(next, this.seeds);
    return {
      nextno: next,
      unoInfo: unoInfo,
    };
  }
}
