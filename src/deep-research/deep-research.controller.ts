import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { DeepResearchService } from './deep-research.service';



@ApiTags('Deep Research')
@Controller('deep-research')
export class DeepResearchController {
  constructor(private readonly researchService: DeepResearchService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        depth: { type: 'number', default: 3 },
        breadth: { type: 'number', default: 3 },
      },
      required: ['query'],
    },
  })
  async research(@Body() body: { query: string; depth?: number; breadth?: number }) {
    const { query, depth = 3, breadth = 3 } = body;
    return this.researchService.runResearch(query, depth, breadth);
  }
}
