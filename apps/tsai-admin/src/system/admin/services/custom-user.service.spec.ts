import { Test, TestingModule } from '@nestjs/testing';
import { CustomUserService } from './custom-user.service';

describe('CustomUserService', () => {
  let service: CustomUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomUserService],
    }).compile();

    service = module.get<CustomUserService>(CustomUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
