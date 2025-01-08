import { Injectable, Logger } from '@nestjs/common';
import { QueryCustomDto } from '../dtos';
import { PageEnum } from '@tsailab/core-types';
import { DataSource } from 'typeorm';
import { convertDBTimeString } from '@tsailab/common';
import { UserEntity, UserService } from '@tsailab/system';

@Injectable()
export class CustomManager {
  private logger = new Logger(CustomManager.name);

  constructor(
    private readonly userService: UserService,
    private readonly datasource: DataSource,
  ) {}

  async querylist(dto: QueryCustomDto) {
    const {
      page = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      keywords,
      status,
      startDate,
      endDate,
    } = dto;

    let qb = this.userService.respository
      .createQueryBuilder('c')
      .withDeleted()
      .select()
      .addSelect('ISNULL(c.password)', 'c_pwunset');

    if (status !== undefined)
      qb = qb.andWhere('c.status = :status', { status });
    if (startDate)
      qb = qb.andWhere('c.created_at >= :start', {
        start: convertDBTimeString(startDate),
      });

    if (endDate)
      qb = qb.andWhere('c.created_at < :end', {
        end: convertDBTimeString(endDate),
      });

    if (keywords?.length) {
      qb = qb.andWhere((subqb) => {
        const filterQb = subqb
          .subQuery()
          .select('sc.id')
          .from(UserEntity, 'sc')
          .withDeleted()
          .andWhere(
            `(
            c.username LIKE :username OR c.email LIKE :email OR c.phone LIKE :prefix OR c.phone LIKE :suffix OR c.userno LIKE :userno
            )`,
            {
              username: `%${keywords}%`,
              email: `${keywords}%`,
              prefix: `${keywords}%`,
              suffix: `%${keywords}`,
              userno: `${keywords}%`,
            },
          )
          .getQuery();
        return 'c.id IN ' + filterQb;
      });

      qb = qb.setParameters({
        keywords,
      });
    }

    const [data, total] = await qb
      .orderBy('created_at', 'DESC')
      .addOrderBy('username', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();

    return {
      page,
      pageSize,
      total,
      list: data ?? [],
    };
  }
}
