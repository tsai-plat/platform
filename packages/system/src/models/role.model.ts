import { StatusEnum } from '@tsailab/core-types';

export class BaseRoleModel {
  id: number;
  name: string;
  description: string;
  status?: StatusEnum;
  isDefault?: boolean;
}

export type CreateRoleModel = Omit<BaseRoleModel, 'id'>;
