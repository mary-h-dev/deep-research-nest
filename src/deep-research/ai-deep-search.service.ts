
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { DeepResearchService } from './deep-research.service';
import { CreateAiDeepSearchDto } from './dto/create-ai-deep-search.dto';
import { UpdateAiDeepSearchDto } from './dto/update-ai-deep-search.dto';

@Injectable()
export class AiDeepSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deepResearch: DeepResearchService,
  ) {}

  async create(dto: CreateAiDeepSearchDto, userId: string) {
    const { query, answers, depth, breadth } = dto;
    if (!answers) {
      const questionsResult = await this.deepResearch.getFollowUpQuestions(query);
      const record = await this.prisma.aiDeepSearch.create({
        data: { userId, query, answers: [], rawResult: questionsResult, finalResult: null, depth: null, breadth: null },
      });
      return { record, researchResult: questionsResult };
    }
    const deepResult = await this.deepResearch.runResearch(query, depth, breadth, answers);
    const record = await this.prisma.aiDeepSearch.create({
      data: {
        userId,
        query,
        answers,
        depth: depth ?? deepResult.parameters.depth,
        breadth: breadth ?? deepResult.parameters.breadth,
        rawResult: deepResult,
        finalResult: deepResult.answer ?? null,
      },
    });
    return { record, researchResult: deepResult };
  }

  async findOne(id: string) {
    const rec = await this.prisma.aiDeepSearch.findUnique({ where: { id } });
    if (!rec) throw new NotFoundException(`Record ${id} not found`);
    return rec;
  }

  async findAll(page = 1, perPage = 10) {
    const [results, count] = await Promise.all([
      this.prisma.aiDeepSearch.findMany({ skip: (page - 1) * perPage, take: perPage, orderBy: { createdAt: 'desc' } }),
      this.prisma.aiDeepSearch.count(),
    ]);
    return {
      results,
      count,
      hasNext: page * perPage < count,
      meta: { currentPage: page, perPage, lastPage: Math.ceil(count / perPage) },
    };
  }

  async update(id: string, dto: UpdateAiDeepSearchDto) {
    await this.findOne(id);
    return this.prisma.aiDeepSearch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.aiDeepSearch.delete({ where: { id } });
    return { deleted: true };
  }
}
