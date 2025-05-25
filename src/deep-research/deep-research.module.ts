import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { DeepResearchController } from './deep-research.controller'
import { DeepResearchService } from './deep-research.service'
import { AiDeepSearchController } from './ai-deep-search.controller'
import { AiDeepSearchService } from './ai-deep-search.service'

@Module({
  imports: [PrismaModule],
  controllers: [
    DeepResearchController,
    AiDeepSearchController,
  ],
  providers: [
    DeepResearchService,
    AiDeepSearchService,
  ],
})
export class DeepResearchModule {}

