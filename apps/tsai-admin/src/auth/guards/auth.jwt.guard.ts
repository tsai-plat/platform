import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

export class AuthJwtGuard extends AuthGuard('jwt') implements IAuthGuard {
  protected logger = new Logger(AuthJwtGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly config: ConfigService,
  ) {
    super();
  }
}
