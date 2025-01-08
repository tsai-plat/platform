import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@tsailab/ioredis-mq';
import { CacheKeyScope, combineCacheKey } from '@tsailab/common';
import { NextNoBiztype } from '@tsailab/core-types/dist';

@Injectable()
export class NextNoCacheManager {
  private logger = new Logger(NextNoCacheManager.name);

  private readonly hashKey = combineCacheKey(
    CacheKeyScope.NEXTNO_HASH,
    'current',
  );

  private readonly autoExtends = 50;

  constructor(private readonly redis: RedisService) {}

  private getNolistKey(biztype: number | string): string {
    return combineCacheKey(
      CacheKeyScope.NEXTNO_LIST.valueOf(),
      biztype.toString(),
      'nos',
    );
  }

  private async precheck(biztype: NextNoBiztype) {
    const k = this.getNolistKey(biztype);
    const size = await this.redis.redisCli.llen(k);
    if (size < 20) {
      await this.increaseUnos(biztype);
    }
  }

  async setHash(biztype: NextNoBiztype, val: number = 0) {
    const cli = this.redis.redisCli;
    await cli.hset(this.hashKey, biztype.toString(), val);
  }

  /**
   * get the first of list nos
   * @param nexttyp Default User
   * @returns number
   */
  async getNextno(
    nexttyp: NextNoBiztype = NextNoBiztype.User,
  ): Promise<number> {
    await this.precheck(nexttyp);
    const k = this.getNolistKey(nexttyp);
    const v = await this.redis.redisCli.lpop(k);
    return Number(v);
  }

  /**
   * reclaim nextno when not used
   * @param no
   * @param nexttyp
   * @returns number
   */
  async reclaimNextno(no: number, nexttyp: NextNoBiztype = NextNoBiztype.User) {
    const k = this.getNolistKey(nexttyp);
    const v = this.redis.redisCli.lpush(k, no);
    return v;
  }

  public async increaseUnos(biztype: NextNoBiztype | number, batch = 1000) {
    const cli = this.redis.redisCli;
    const listKey = this.getNolistKey(biztype);
    const size = await cli.llen(listKey);
    if (size > this.autoExtends) {
      return `has ${size} unos, no need create news.`;
    }

    let start: number = 0;
    let len = batch;
    if (size) {
      const v = await cli.rpop(listKey);
      if (v && parseInt(v) > 0) {
        start = parseInt(v);
        len = len + 1;
      }
    } else if (await cli.hexists(this.hashKey, biztype.toString())) {
      const v = await cli.hget(this.hashKey, biztype.toString());
      if (v && parseInt(v) > 0) start = parseInt(v) + 1;
    }

    const nos: number[] = [];
    let nextno = start;
    for (let i = 0; i < len; i++) {
      nos.push(nextno);
      nextno++;
    }

    await cli.rpush(listKey, ...nos);

    return `Has been init ${nos.length} uno into cache`;
  }
}
