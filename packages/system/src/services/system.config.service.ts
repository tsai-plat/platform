import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SystemConfigService {
  private readonly seedsKey = 'system.unoSeeds';
  protected seeds: string[] = [];
  constructor(private readonly config: ConfigService) {
    const conf = config.get('system.unoSeeds', null);
    if (conf && Array.isArray(conf)) {
      let unoSeeds = conf as unknown as string[];
      unoSeeds = unoSeeds
        .filter((v) => /[\d]{1,4}/.test(v))
        .map((v) => `000${v}`.slice(-4));

      this.seeds = [...unoSeeds];
    }
  }

  public getUnoSeeds() {
    return this.seeds;
  }
}
