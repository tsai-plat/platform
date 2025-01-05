import { ValueTransformer } from 'typeorm';

export const bigint: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => Number(databaseValue).valueOf(),
};
