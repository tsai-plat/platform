import { EntitySchema } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type EntityClassOrSchema = Function | EntitySchema;
export interface UCenterModuleOptions {
  debug?: boolean;
  isGlobal?: boolean;
}
