import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags } from '@nestjs/swagger';
// import { PublicApi } from '@tsai-platform/core';

@ApiTags(`终端用户-APIs`)
@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  // @PublicApi()
  @Get('get/:uno')
  getUserByuno(@Param('uno') uno: string) {
    return this.service.getUser(uno);
  }
}
