export class MissConfigurationError extends Error {
  constructor(subDesc: string = '') {
    super(`Missing required asynchronous configurations.${subDesc ?? ''}`);
    this.name = MissConfigurationError.name;
  }
}
