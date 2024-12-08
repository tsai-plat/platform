export type BaseEntityPropsType = {
  id: number;
  orgno: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
