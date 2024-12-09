import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemUserEntity } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SystemUserEntity)
    private readonly accountReository: Repository<SystemUserEntity>,
  ) {}

  public get accRepository() {
    return this.accountReository;
  }

  getById(id: number): Promise<SystemUserEntity | null> {
    return this.accountReository.findOneBy({ id });
  }

  getByUno(uno: string): Promise<SystemUserEntity | null> {
    return this.accountReository.findOneBy({ userno: uno });
  }
}
