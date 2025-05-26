import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'nestjs-prisma';
import { buildProfessionalQuestions } from './engine/feedback';
import { generateObject } from 'ai';
import { getModel } from './engine/ai-providers';
import { systemPrompt } from './engine/prompt';
import { deepResearch, writeFinalAnswer, writeFinalReport } from './engine/deep-research-engine';
import { z } from 'zod';
import * as FormData from 'form-data';
import { StorageService } from '../storage/storage.service';
import { FileEntityType } from '../storage/file-entity-type.enum';




@Injectable()
export class DeepResearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  async getFollowUpQuestions(query: string) {
    const { questions, formatted } = await buildProfessionalQuestions(query);
    return { questions, formatted };
  }

  async runResearch(query: string, depth?: number, breadth?: number, answers?: string[]) {
    if (!answers || !Array.isArray(answers)) {
      throw new Error('Answers array is required for running research');
    }
    const params = await this.estimateResearchParameters(query, answers);
    const finalDepth = depth ?? params.depth;
    const finalBreadth = breadth ?? params.breadth;
    const combinedPrompt = `
Main Question: ${query}

User's Detailed Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Research Parameters: depth=${finalDepth}, breadth=${finalBreadth}
    `;
    const progressLog: string[] = [];
    const { learnings, visitedUrls } = await deepResearch({
      query: combinedPrompt,
      depth: finalDepth,
      breadth: finalBreadth,
      onProgress: (p) => {
        progressLog.push(
          `Progress: D${p.currentDepth}/${p.totalDepth} B${p.currentBreadth}/${p.totalBreadth} ` +
            `[${p.completedQueries}/${p.totalQueries}] "${p.currentQuery}"`,
        );
      },
    });
    const report = await writeFinalReport({ prompt: combinedPrompt, learnings, visitedUrls });
    const answer = await writeFinalAnswer({ prompt: combinedPrompt, learnings });
    const deepSearchRecord = await this.prisma.aiDeepSearch.create({
      data: {
        userId: 'user-id',
        query,
        answers,
        depth: finalDepth,
        breadth: finalBreadth,
        rawResult: { summary: answer, report, visitedUrlsCount: visitedUrls.length, learnings },
      },
    });
    const deepSearchRecordId = deepSearchRecord.id;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const prefix = (name: string) => `${name}_${ts}`;
    const reportPath = await this.uploadFile(`${prefix('report')}.md`, report);
    const progressPath = await this.uploadFile(`${prefix('progress')}.log`, progressLog.join('\n'));
    const answerPath = await this.uploadFile(`${prefix('answer')}.md`, answer);
    const learningsPath = await this.uploadFile(`${prefix('learnings')}.json`, JSON.stringify(learnings, null, 2));
    const urlsPath = await this.uploadFile(`${prefix('visited')}.txt`, visitedUrls.join('\n'));
    await this.saveFile('report.md', reportPath, deepSearchRecordId);
    await this.saveFile('progress.log', progressPath, deepSearchRecordId);
    await this.saveFile('answer.md', answerPath, deepSearchRecordId);
    await this.saveFile('learnings.json', learningsPath, deepSearchRecordId);
    await this.saveFile('visited.txt', urlsPath, deepSearchRecordId);
    return {
      success: true,
      report,
      answer,
      parameters: { depth: finalDepth, breadth: finalBreadth, reasoning: params.reasoning },
      learnings: learnings.map((l) => ({ fact: l.learning, sources: l.sources })),
      visitedUrlsCount: visitedUrls.length,
      files: { report: reportPath, progress: progressPath, learnings: learningsPath, answer: answerPath, urls: urlsPath },
    };
  }

  private async estimateResearchParameters(query: string, answers: string[]) {
    const estimation = await generateObject({
      model: getModel(),
      system: systemPrompt(),
      prompt: `
Based on the following user question and answers, estimate suitable values for "depth" and "breadth"...
Main Question: ${query}
User Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join('\n')}
Respond with JSON: { depth, breadth, reasoning, complexity, researchScope }
      `,
      schema: z.object({
        depth: z.number().min(1).max(5),
        breadth: z.number().min(2).max(10),
        reasoning: z.string(),
        complexity: z.enum(['low', 'medium', 'high', 'very_high']),
        researchScope: z.array(z.string()),
      }),
    });
    return estimation.object;
  }

  private async uploadFile(filename: string, content: string) {
    const buffer = Buffer.from(content);         
    const form = new FormData();
    form.append('file', buffer, { filename });   
  
    const response = await this.httpService.axiosRef.post(
      'http://localhost:3000/storage/upload',
      form,
      { headers: form.getHeaders() },
    );
  
    return response.data.path;
  }
  

  private async saveFile(originalName: string, path: string, entityId: string) {
    await this.storageService.saveFileMetadata({
      originalName,
      filename: originalName,
      path,
      entityId,
      entityType: FileEntityType.AI_DEEP_SEARCH,
    });
  }
}
