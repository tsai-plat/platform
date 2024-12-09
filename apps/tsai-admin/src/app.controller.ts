import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(`Application endpoint wiki`)
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @ApiOperation({
    summary: 'health beat',
  })
  @Get('health')
  async getHealth(): Promise<string> {
    return await this.service.health();
  }
}
