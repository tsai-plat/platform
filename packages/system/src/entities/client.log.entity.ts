import { BaseEntity } from '@tsailab/common';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';

@Entity({
  name: 'loto_client_log',
  synchronize: true,
})
export class ClientLogEntity extends BaseEntity {
  @Index()
  @Column({
    name: 'bizcode',
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: 'log bizcode from dict or channel name',
  })
  bizcode: string;
  @Index()
  @Column({
    name: 'action',
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'log source code',
  })
  action: string;

  @Column({
    name: 'refid',
    type: 'varchar',
    nullable: true,
    length: 100,
    comment: 'log relative other table id or key',
  })
  refid: string;

  @Column({
    name: 'operator',
    type: 'varchar',
    nullable: true,
    length: 100,
    comment: 'log operator',
  })
  operator: string;

  @Column({
    name: 'result',
    type: 'varchar',
    nullable: true,
    length: 200,
    comment: 'the execute result success or fail.',
  })
  result: string;

  @Column({
    name: 'reqjson',
    nullable: true,
    type: 'longtext',
    comment: 'reqdata',
  })
  reqjson: string;
  @Column({
    name: 'respjson',
    nullable: true,
    type: 'longtext',
    comment: 'respdata',
  })
  respjson: string;

  @Column({
    name: 'options',
    nullable: true,
    type: 'longtext',
    comment: 'req options',
  })
  options: string;
  @Column({
    name: 'error',
    type: 'varchar',
    nullable: true,
    length: 2000,
    comment: 'error string',
  })
  error: string;

  @Column({
    name: 'extrajson',
    nullable: true,
    type: 'longtext',
    comment: 'extra json',
  })
  extrajson: string;

  @Type(() => Boolean)
  @Transform((o) => Boolean(o.value))
  @Column({
    name: 'locked',
    type: 'tinyint',
    nullable: true,
    default: 0,
    comment: 'locked',
  })
  locked: boolean;

  @Column({
    name: 'typ',
    type: 'varchar',
    nullable: true,
    default: '',
    comment: 'log record type',
  })
  typ: string;
}
