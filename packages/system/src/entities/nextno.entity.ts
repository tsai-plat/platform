import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'sys_next_no',
  synchronize: true,
  comment: 'No序列表',
})
@Unique('uq_no_biztype', ['no', 'biztype'])
export class NextNoEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Primary key ID',
  })
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  id: number;

  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  @Column({
    type: 'bigint',
    nullable: true,
    default: 1,
    name: 'no',
    comment: 'squence No. type',
  })
  no: number;

  @Column({
    type: 'int',
    nullable: true,
    default: 1,
    name: 'biztype',
    comment: 'squence No. type',
  })
  biztype: number;

  @Type(() => Boolean)
  @Transform(({ value }) => Boolean(value))
  @Column({
    type: 'tinyint',
    nullable: true,
    default: 0,
    name: 'locked',
    comment: 'locked',
  })
  locked: boolean;

  @Type(() => Boolean)
  @Transform(({ value }) => Boolean(value))
  @Column({
    type: 'tinyint',
    nullable: true,
    default: 0,
    name: 'used',
    comment: 'has been used',
  })
  used: boolean;

  @Transform((row: TransformFnParams) => +new Date(row.value))
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    comment: 'record last update time',
  })
  updatedAt: Date;
}
