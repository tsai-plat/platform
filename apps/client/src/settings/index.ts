export * from './ssl.options';
export const isDevMode =
  process.env.STAGE === 'dev' || process.env.STAGE === 'development';
