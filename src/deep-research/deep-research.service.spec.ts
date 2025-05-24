import { Test, TestingModule } from '@nestjs/testing';
import { DeepResearchService } from './deep-research.service';

describe('DeepResearchService', () => {
  let service: DeepResearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeepResearchService],
    }).compile();

    service = module.get<DeepResearchService>(DeepResearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
