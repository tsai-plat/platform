import { resolve } from 'path';

export const isProdRuntime = () =>
  process.env.STAGE === 'production' || process.env.STAGE === 'prod';

export function resolveAppDir(...p): string {
  return resolve(process.cwd(), ...p);
}
