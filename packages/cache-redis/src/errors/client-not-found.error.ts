export class RedisClientNotFoundError extends Error {
  constructor(namespace: string) {
    super(`Connection "${namespace}" was not found.`);
    this.name = RedisClientNotFoundError.name;
  }
}
