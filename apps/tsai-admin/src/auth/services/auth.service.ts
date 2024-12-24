import { Injectable, Logger } from '@nestjs/common';
import { ROOT_APP_NAME } from '../auth.constants';
import { SigninLocalDto } from '../dtos';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  protected logger = new Logger(`${ROOT_APP_NAME}-${AuthService.name}`);

  constructor(private readonly authHelper: AuthHelper) {}

  login(dto: SigninLocalDto) {}
}
