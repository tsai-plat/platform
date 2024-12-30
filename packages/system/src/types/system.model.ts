import { StatusEnum } from '@tsailab/core-types';

export type RegionModelType = {
  id: number;
  pid: number;
  name: string;
  code: string;
  value: string;
  tag: string;
  remark: string;
  extra?: Record<string, any>;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date;
  sortno?: number;
  status?: StatusEnum;
};
