import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextNoCacheManager } from '@tsai-platform/core';
import { RandomHelper } from '@tsailab/common';
import { NextNoType } from '@tsailab/core-types';

@Injectable()
export class NextNoManager {
  private seeds: Array<any> = [];
  constructor(
    private readonly config: ConfigService,
    private readonly nextnoCacher: NextNoCacheManager,
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

  async batchInitNextnos(size: number = 1000) {
    return await this.nextnoCacher.increaseUnos(NextNoType.USER, size);
  }

  async getNextno(biztype: NextNoType) {
    const next = await this.nextnoCacher.getNextno(biztype);

    const unoInfo = RandomHelper.buildUno(next, this.seeds);
    return {
      nextno: next,
      unoInfo: unoInfo,
    };
  }
}
