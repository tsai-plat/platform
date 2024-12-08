export class InjectInstNotFoundError extends Error {
  constructor(injectName: string = '') {
    super(
      `Instance of [${injectName}] was not found.check either inject in Module.`,
    );
    this.name = InjectInstNotFoundError.name;
  }
}
