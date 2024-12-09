import { Test, TestingModule } from '@nestjs/testing';
import { ApiV1Controller } from './api-v1.controller';
import { ApiV1Service } from './api-v1.service';

describe('ApiV1Controller', () => {
  let apiV1Controller: ApiV1Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiV1Controller],
      providers: [ApiV1Service],
    }).compile();

    apiV1Controller = app.get<ApiV1Controller>(ApiV1Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apiV1Controller.getHello()).toBe('Hello World!');
    });
  });
});
