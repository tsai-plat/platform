import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IgnoreTransformAPI, PublicApi } from '@tsai-platform/core';

@ApiTags(`Application endpoint wiki`)
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @PublicApi()
  @ApiOperation({
    summary: 'health beat',
  })
  @IgnoreTransformAPI()
  @Get('health')
  async getHealth(): Promise<string> {
    return await this.service.health();
  }
}
