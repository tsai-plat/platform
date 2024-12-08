import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TsaiAdminModuleRoutes } from 'src/api/api.routes';

@ApiTags(`${TsaiAdminModuleRoutes.authRoute.name} API`)
@Controller('system')
export class SigninController {
  constructor() {}

  @Post('login')
  login(@Body() dto: any) {
    return dto;
  }
}
