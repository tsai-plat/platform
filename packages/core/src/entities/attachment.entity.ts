import { BaseEntity } from '@tsailab/common';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'loto_attchment',
  comment: '附件表',
})
export class AttachmentEntity extends BaseEntity {
  @Column({
    name: 'filename',
    type: 'varchar',
    nullable: false,
    length: 256,
    comment: 'attachment file name,not contains path',
  })
  filename: string;
  @Column({
    name: 'pathname',
    type: 'varchar',
    nullable: true,
    length: 256,
    comment: 'attachment file server pathname',
  })
  pathname: string;
  @Column({
    name: 'url',
    type: 'varchar',
    nullable: true,
    length: 256,
    comment: 'attachment file remote url,oss or proxy link',
  })
  url: string;
  @Column({
    name: 'thumb',
    type: 'varchar',
    nullable: true,
    length: 256,
    comment: 'attachment thumb,image or video has.',
  })
  thumb: string;
  @Column({
    name: 'osstype',
    type: 'varchar',
    nullable: true,
    length: 128,
    default: '',
    comment: 'oss provider type,see core-types',
  })
  osstype: string;
  @Column({
    name: 'ossid',
    type: 'varchar',
    nullable: true,
    length: 128,
    comment: 'oss provide id,cos etag',
  })
  ossid: string;
  @Column({
    name: 'tag',
    type: 'varchar',
    nullable: true,
    length: 512,
    comment: 'attachment tag,multi use special , sign split',
  })
  tag: string;
  @Column({
    name: 'filetype',
    type: 'varchar',
    nullable: true,
    length: 64,
    comment: 'Attachment file type,see core-types, docment,audio.etd.',
  })
  filetype: string;
  @Column({
    name: 'user',
    type: 'varchar',
    nullable: true,
    length: 128,
    default: '',
    comment: 'username',
  })
  user: string;
  @Column({
    name: 'batchid',
    type: 'varchar',
    nullable: true,
    length: 64,
    comment: 'client upload multi files,batch id',
  })
  batchid: string;
  @Column({
    name: 'refid',
    type: 'int',
    nullable: true,
    default: -1,
    comment: 'reffered table record id',
  })
  refid: number;
  @Column({
    name: 'reftb',
    type: 'varchar',
    nullable: true,
    default: '',
    length: 128,
    comment: 'reffered table name',
  })
  reftb: string;
  @Column({
    name: 'locked',
    type: 'tinyint',
    nullable: true,
    default: 0,
    comment: 'record server file can delete',
  })
  locked: boolean;
  @Column({
    name: 'extra',
    type: 'longtext',
    default: null,
    comment: 'attachment extra json',
  })
  extra: string;
  @Column({
    name: 'state',
    type: 'int',
    nullable: true,
    default: 0,
    comment:
      'attachment file state: 0 only db record,1 on server ,3 server & oss,2 only oss',
  })
  state: number;
  @Column({
    type: 'varchar',
    nullable: true,
    default: '',
    name: 'orgno',
    comment: 'orgno',
  })
  orgno: string;

  @Column({
    name: 'remark',
    type: 'varchar',
    default: '',
    comment: 'record operator change remark',
  })
  remark: string;
}
