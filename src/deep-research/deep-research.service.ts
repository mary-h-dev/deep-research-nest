// src/deep-research/deep-research.service.ts
import { Injectable } from '@nestjs/common';
import { buildProfessionalQuestions } from './engine/feedback';
import { generateObject } from 'ai';
import { getModel } from './engine/ai-providers';
import { systemPrompt } from './engine/prompt';
import {
  deepResearch,
  writeFinalAnswer,
  writeFinalReport,
} from './engine/deep-research-engine';
import * as fs from 'fs/promises';
import { z } from 'zod';

@Injectable()
export class DeepResearchService {
  async getFollowUpQuestions(query: string) {
    const { questions, formatted } = await buildProfessionalQuestions(query);
    return { questions, formatted };
  }

  async runResearch(
    query: string,
    depth?: number,
    breadth?: number,
    answers?: string[],
  ) {
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

    const report = await writeFinalReport({
      prompt: combinedPrompt,
      learnings,
      visitedUrls,
    });
    const answer = await writeFinalAnswer({
      prompt: combinedPrompt,
      learnings,
    });

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const prefix = (name: string) => `${name}_${ts}`;
    await fs.writeFile(prefix('report') + '.md', report);
    await fs.writeFile(prefix('progress') + '.log', progressLog.join('\n'));
    await fs.writeFile(prefix('answer') + '.md', answer);
    await fs.writeFile(
      prefix('learnings') + '.json',
      JSON.stringify(learnings, null, 2),
    );
    await fs.writeFile(prefix('visited') + '.txt', visitedUrls.join('\n'));

    
    // await this.fileService.create({
    //   path: prefix('report') + '.md',
    //   entityId: deepSearchRecord.id,
    //   entityType: FileEntityType.AI_DEEP_SEARCH,
    // });



    return {
      success: true,
      report,
      answer,
      parameters: {
        depth: finalDepth,
        breadth: finalBreadth,
        reasoning: params.reasoning,
      },
      learnings: learnings.map((l) => ({
        fact: l.learning,
        sources: l.sources,
      })),
      visitedUrlsCount: visitedUrls.length,
      files: {
        report: prefix('report') + '.md',
        progress: prefix('progress') + '.log',
        learnings: prefix('learnings') + '.json',
        answer: prefix('answer') + '.md',
        urls: prefix('visited') + '.txt',
      },
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
}
