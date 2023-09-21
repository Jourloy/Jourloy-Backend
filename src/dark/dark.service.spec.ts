import { Test, TestingModule } from '@nestjs/testing';
import { DarkService } from './dark.service';

describe('DarkService', () => {
  let service: DarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DarkService],
    }).compile();

    service = module.get<DarkService>(DarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
