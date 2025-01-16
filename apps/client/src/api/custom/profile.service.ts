import { Injectable } from '@nestjs/common';
import { UserService } from '@tsailab/system';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  getUser(uno: string) {
    return this.userService.getByUserno(uno);
  }
}
