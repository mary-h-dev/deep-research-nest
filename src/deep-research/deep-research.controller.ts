
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { DeepResearchService } from './deep-research.service'
import { CreateQuestionsDto } from './dto/create-questions.dto'
import { RunResearchDto } from './dto/run-research.dto'

@ApiTags('Deep Research')
@Controller('api/deep-research')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class DeepResearchController {
  constructor(private readonly researchService: DeepResearchService) {}

  @Post('questions')
  @ApiOperation({ summary: 'Generate follow-up questions for the user’s query' })
  createQuestions(@Body() dto: CreateQuestionsDto): Promise<{ questions: string[]; formatted: string }> {
    return this.researchService.getFollowUpQuestions(dto.query)
  }

  @Post('run')
  @ApiOperation({ summary: 'Execute deep research with provided answers' })
  runResearch(@Body() dto: RunResearchDto): Promise<any> {
    return this.researchService.runResearch(dto.query, dto.depth, dto.breadth, dto.answers)
  }
}
