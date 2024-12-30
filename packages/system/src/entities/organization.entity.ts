import { BaseEntity } from '@tsailab/common';
import { StatusEnum } from '@tsailab/core-types';
import { Type } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'sys_organization', synchronize: true })
export class OrganizationEntity extends BaseEntity {
  @Column({
    type: 'int',
    nullable: true,
    name: 'pid',
    default: 0,
    comment: 'parent id',
  })
  pid?: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'name',
    comment: 'org name',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: '',
    name: 'orgno',
    comment: 'orgno',
  })
  @Index()
  orgno: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'code',
    comment: 'org code',
  })
  code?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'short_name',
    comment: 'short name',
  })
  shortName?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'icon',
    comment: 'organization icon',
  })
  icon?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'description',
    comment: 'description',
  })
  description?: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'sortno',
    default: 1,
    comment: 'sort no',
  })
  sortno: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'level',
    default: 1,
    comment: 'sort no',
  })
  level: number;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 1,
    name: 'status',
    comment: 'status:0-unavailable,1-available',
  })
  status: StatusEnum;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 0,
    name: 'locking',
    comment: 'Is locked for deleted,',
  })
  @Type(() => Boolean)
  locking: boolean;
}
