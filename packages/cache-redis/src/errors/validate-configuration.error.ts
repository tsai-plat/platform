export class ValidateConfigurationError extends Error {
  constructor() {
    super(
      `Missing required asynchronous configurations. Expected one of: "useFactory", "useClass", "useExisting".`,
    );
    this.name = ValidateConfigurationError.name;
  }
}
