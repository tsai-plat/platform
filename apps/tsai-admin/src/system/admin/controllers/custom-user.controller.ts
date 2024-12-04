import { Controller, Get, Param } from '@nestjs/common';
import { CustomUserService } from '../services/custom-user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(`客戶後臺管理`)
@Controller('custom/user')
export class CustomUserController {
  constructor(private readonly customService: CustomUserService) {}

  @ApiOperation({
    summary: '查询用户信息',
  })
  @Get('by_uno/:no')
  getByUserno(@Param('no') no: string) {
    return this.customService.getCustomUserByUno(no);
  }
}
