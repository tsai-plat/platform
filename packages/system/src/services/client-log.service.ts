import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientLogEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MQLogPayload, MQRequestOption } from '@tsailab/core-types';
import { BizException } from '@tsailab/common';

@Injectable()
export class ClientLogService {
  protected logger = new Logger(ClientLogService.name);

  constructor(
    @InjectRepository(ClientLogEntity)
    private readonly logRepository: Repository<ClientLogEntity>,
  ) {}

  get repository(): Repository<ClientLogEntity> {
    return this.logRepository;
  }

  /**
   *
   * @param payload
   * @param type log record type
   * @param locked
   * @returns
   */
  async createClientLog(
    payload: MQLogPayload,
    type: string,
    locked: boolean = false,
  ): Promise<ClientLogEntity | never> {
    const entity = ClientLogService.buildClientLogEntity(payload, {
      typ: type,
      locked,
    });

    return await this.repository.save(this.logRepository.create(entity));
  }

  static buildClientLogEntity(
    payload: MQLogPayload,
    options: { locked?: boolean; typ: string } = { locked: false, typ: '' },
  ): Partial<ClientLogEntity> {
    const {
      bizcode,
      action,
      refid,
      launchTime = Date.now(),
      result = 'Success',
      reqdata,
      respdata,
      operator,
      error,
      extra,
    } = payload;

    const { locked, typ } = options;

    if (!bizcode?.length) {
      throw BizException.IllegalParamterError(`bizcode required`);
    }

    const opts: MQRequestOption = {
      ...payload.options,
      launchTime,
    };

    const entity: Partial<ClientLogEntity> = {
      bizcode,
      action,
      refid,
      result,
      reqjson: reqdata ? JSON.stringify(reqdata) : undefined,
      respjson: respdata ? JSON.stringify(respdata) : undefined,
      operator,
      options: JSON.stringify(opts),
      error,
      extrajson: extra ? JSON.stringify(extra) : undefined,
      locked: payload?.locked || locked,
      typ,
    };

    return entity;
  }
}
