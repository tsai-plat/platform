import { Injectable } from '@nestjs/common';
import { UserService } from '@tsai-platform/ucenter';

@Injectable()
export class CustomUserService {
  constructor(private readonly userService: UserService) {}

  getCustomUserByUno(userno: string) {
    return this.userService.getByUserno(userno);
  }
}
