import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextNoEntity } from '../../entities';
import { Repository } from 'typeorm';
import { BizException } from '@tsailab/common';
import { NextNoBiztype } from '@tsailab/core-types';

@Injectable()
export class NextNoService {
  private maxBatch = 200;
  constructor(
    @InjectRepository(NextNoEntity)
    private readonly nextnoRepository: Repository<NextNoEntity>,
  ) {}

  async getMaxNo(biztype: number): Promise<number> {
    if (!biztype) throw BizException.IllegalParamterError(`biztype required.`);
    const type =
      typeof biztype === 'object'
        ? (biztype as NextNoBiztype).valueOf()
        : (biztype as number);

    const raw = await this.nextnoRepository
      .createQueryBuilder('n')
      .select('MAX(no)', 'maxNo')
      .where({ biztype: type })
      .getRawOne();

    if (!raw) return 0;
    return Number(+raw.maxNo).valueOf();
  }

  async initicalizeNextBatchNos(
    biztype: number,
    batchSize: number,
    locked?: boolean,
  ): Promise<number> {
    if (batchSize <= 0 || batchSize > 10000)
      throw BizException.IllegalParamterError(`Max batch size require 1~1000`);

    const qb = this.nextnoRepository.createQueryBuilder();

    const currentMaxno = await this.getMaxNo(biztype);
    const batchValues: Array<Partial<NextNoEntity>> = [];
    let nextno = currentMaxno;
    if (batchSize < this.maxBatch) {
      for (let i = 0; i < batchSize; i++) {
        nextno++;
        batchValues.push({
          no: nextno,
          biztype,
          locked: !!locked,
        });
      }
      await qb.insert().into(NextNoEntity).values(batchValues).execute();

      return nextno;
    }

    async function batch(curr: number, count: number): Promise<number> {
      const values: Array<Partial<NextNoEntity>> = [];
      let start = curr;
      for (let j = 0; j < count; j++) {
        start++;
        values.push({
          no: start,
          biztype,
          locked: !!locked,
        });
      }

      await qb.insert().into(NextNoEntity).values(values).execute();
      return start;
    }

    let left = batchSize;

    while (left > 0) {
      const c = left > this.maxBatch ? this.maxBatch : left;
      nextno = await batch(nextno, c);

      left = left - c;
    }

    return nextno;
  }

  async getEnableNextNo(biztype: number): Promise<number> {
    if (!biztype || biztype < 0)
      throw BizException.IllegalParamterError(`biztype required.`);
    const row = await this.nextnoRepository
      .createQueryBuilder()
      .where({ biztype, locked: false, used: false })
      .orderBy('no', 'ASC')
      .getOne();

    if (!row) return 1;
    return Number(+row.no).valueOf();
  }

  async updateNextnoUsed(biztype: number, nextno: number) {
    if (!biztype || biztype < 0)
      throw BizException.IllegalParamterError(`biztype required.`);

    const qb = this.nextnoRepository.createQueryBuilder();

    const find = await qb.where({ no: nextno, biztype }).getOne();
    if (find) {
      const { affected } = await qb
        .update(NextNoEntity)
        .set({ used: true })
        .where('no = :no AND biztype = :biztype', { no: nextno, biztype })
        .execute();

      return affected > 0;
    }
    await qb.insert().into(NextNoEntity).values({
      no: nextno,
      biztype,
      locked: false,
      used: true,
    });
    return true;
  }

  async autoInitBatchNosOnModuleInit(
    biztype: number = 1,
    batchSize: number = 1000,
  ) {
    const qb = this.nextnoRepository.createQueryBuilder();

    const unusedCnt = await qb
      .andWhere({ biztype, used: false, locked: false })
      .getCount();

    if (unusedCnt > 100) return 0;
    await this.initicalizeNextBatchNos(biztype, batchSize);
    return batchSize;
  }
}
