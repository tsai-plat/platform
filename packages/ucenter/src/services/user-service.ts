import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm';
import { BizException, ErrorCodeEnum } from '@tsai-platform/common';

@Injectable()
export class UserService {
  protected logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public getById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  public get userRepo(): Repository<UserEntity> {
    return this.userRepository;
  }

  public getByUserno(no: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder()
      .withDeleted()
      .where({ userno: no })
      .getOne();
  }

  public getByOpenid(openid: string) {
    return this.userRepository
      .createQueryBuilder()
      .withDeleted()
      .where({ openid: openid })
      .getOne();
  }

  public getByPhone(phone: string) {
    return this.userRepository
      .createQueryBuilder()
      .withDeleted()
      .where({ phone: phone })
      .getOne();
  }

  public async insertNew(
    model: Partial<
      Omit<
        UserEntity,
        'id' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'
      >
    >,
    enPassword: string,
  ): Promise<UserEntity | never> {
    if (!enPassword?.trim()?.length) {
      throw BizException.IllegalParamterError(`password required.`);
    }
    const { userno, openid, phone } = model;

    if (!userno?.length) {
      throw BizException.IllegalParamterError(`userno required.`);
    }

    if (openid?.length) {
      const wxUser = await this.getByOpenid(openid);
      if (wxUser) {
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `User wechat openid: ${openid} has exists in DB.`,
        );
      }
    }

    if (phone?.length) {
      const mobUser = await this.getByPhone(phone);
      if (mobUser) {
        throw BizException.createError(
          ErrorCodeEnum.DATA_RECORD_CONFLICT,
          `User phone: ${phone} has exists in DB.`,
        );
      }
    }

    const created = await this.userRepository.save(
      this.userRepository.create({ ...model, password: enPassword }),
    );

    return created;
  }
}
