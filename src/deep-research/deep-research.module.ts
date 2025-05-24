import { Module } from '@nestjs/common';
import { DeepResearchController } from './deep-research.controller';
import { DeepResearchService } from './deep-research.service';

@Module({
  controllers: [DeepResearchController],
  providers: [DeepResearchService]
})
export class DeepResearchModule {}
