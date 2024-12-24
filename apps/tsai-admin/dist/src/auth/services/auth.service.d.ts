import { Logger } from '@nestjs/common';
import { SigninLocalDto } from '../dtos';
import { AuthHelper } from './auth.helper';
export declare class AuthService {
    private readonly authHelper;
    protected logger: Logger;
    constructor(authHelper: AuthHelper);
    login(dto: SigninLocalDto): void;
}
