import { Test, TestingModule } from '@nestjs/testing';
import { DeepResearchController } from './deep-research.controller';

describe('DeepResearchController', () => {
  let controller: DeepResearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeepResearchController],
    }).compile();

    controller = module.get<DeepResearchController>(DeepResearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
