import { Test, TestingModule } from '@nestjs/testing';
import { SystemInitService } from './system-init.service';

describe('SystemInitService', () => {
  let service: SystemInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemInitService],
    }).compile();

    service = module.get<SystemInitService>(SystemInitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
