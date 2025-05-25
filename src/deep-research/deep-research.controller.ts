// src/deep-research/deep-research.controller.ts
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeepResearchService } from './deep-research.service';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { RunResearchDto } from './dto/run-research.dto';

@ApiTags('Deep Research')
@Controller('deep-research')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class DeepResearchController {
  constructor(private readonly researchService: DeepResearchService) {}

  @Post('questions')
  @ApiOperation({ summary: 'Generate follow-up questions for the user’s query' })
  async createQuestions(
    @Body() dto: CreateQuestionsDto,
  ): Promise<{ questions: string[]; formatted: string }> {
    return this.researchService.getFollowUpQuestions(dto.query);
  }

  @Post('run')
  @ApiOperation({ summary: 'Execute deep research with provided answers' })
  async runResearch(
    @Body() dto: RunResearchDto,
  ): Promise<any> {
    const { query, depth, breadth, answers } = dto;
    return this.researchService.runResearch(query, depth, breadth, answers);
  }
}
