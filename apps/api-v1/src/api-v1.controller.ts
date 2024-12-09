import { Controller, Get } from '@nestjs/common';
import { ApiV1Service } from './api-v1.service';

@Controller()
export class ApiV1Controller {
  constructor(private readonly apiV1Service: ApiV1Service) {}

  @Get()
  getHello(): string {
    return this.apiV1Service.getHello();
  }
}
