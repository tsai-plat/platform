import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AttachmentEntity } from '../../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { UuidGenerator } from '@tsailab/common';

//const APP_UPLOAD_OSS_CONF_KEY = 'app.upload.oss';
@Injectable()
export class AttachmentService {
  public readonly serveBase;
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachRepository: Repository<AttachmentEntity>,
  ) {}

  getById(id: number) {
    return this.attachRepository.findOneBy({ id });
  }

  get repository() {
    return this.attachRepository;
  }

  create(entity: Partial<AttachmentEntity>) {
    return this.attachRepository.save(this.attachRepository.create(entity));
  }

  updateStateById(id: number, state: number) {
    return this.attachRepository
      .createQueryBuilder()
      .update(AttachmentEntity)
      .set({ state })
      .where({ id })
      .execute();
  }

  updateStateByIds(state: number, ids: number[]) {
    return this.attachRepository
      .createQueryBuilder()
      .update({ state })
      .whereInIds(ids)
      .execute();
  }

  async updateSomeById(
    some: Partial<Omit<AttachmentEntity, 'id' | 'createdAt'>> & {
      id: number;
    },
  ) {
    const { id, ...others } = some;
    return await this.attachRepository
      .createQueryBuilder()
      .update(AttachmentEntity)
      .set({ ...others })
      .where({ id })
      .execute();
  }

  async batchCreate(
    values: Array<
      Partial<Omit<AttachmentEntity, 'id' | 'createdAt' | 'updatedAt'>>
    >,
  ) {
    let hasBatchid = false;

    values.forEach((v) => {
      if (v.batchid?.length) hasBatchid = true;
    });
    if (!hasBatchid) {
      const batchid = UuidGenerator.genBase58Uuid(20);
      values.map((v) => ({
        ...v,
        batchid: batchid,
      }));
    }

    /**
     * multi insert
     * return identifiers[],generatedMaps[],raw:any
     */
    const insertRet = await this.attachRepository
      .createQueryBuilder()
      .insert()
      .into(AttachmentEntity)
      .values(values)
      .execute();

    return insertRet;
  }
}
