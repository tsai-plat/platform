import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiV1Service {
  getHello(): string {
    return 'Hello World!';
  }
}
