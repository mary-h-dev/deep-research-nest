import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'nestjs-prisma';
import { DeepResearchController } from './deep-research.controller';
import { DeepResearchService } from './deep-research.service';
import { AiDeepSearchController } from './ai-deep-search.controller';
import { AiDeepSearchService } from './ai-deep-search.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    HttpModule,
    StorageModule,
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  controllers: [DeepResearchController, AiDeepSearchController],
  providers: [DeepResearchService, AiDeepSearchService],
})


export class DeepResearchModule {}
