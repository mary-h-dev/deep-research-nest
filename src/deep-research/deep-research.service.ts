import { Injectable } from '@nestjs/common';
import { deepResearch, writeFinalAnswer } from './engine/deep-research';

@Injectable()
export class DeepResearchService {
  async runResearch(query: string, depth: number, breadth: number) {
    try {
      const { learnings, visitedUrls } = await deepResearch({
        query,
        depth,
        breadth,
      });

      const answer = await writeFinalAnswer({ prompt: query, learnings });

      return { answer, learnings, visitedUrls };
    } catch (error) {
      console.error('🔥 Error in runResearch:', error);
      throw error;
    }
  }
}
