import { Logger } from '@nestjs/common';
import { AuthHelper } from './auth.helper';

export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private readonly authHelper: AuthHelper) {}
}
