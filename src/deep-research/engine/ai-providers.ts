import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModelV1 } from 'ai';
import { getEncoding } from 'js-tiktoken';
import { RecursiveCharacterTextSplitter } from './text-splitter';


export function getModel(): LanguageModelV1 {
  const openai = process.env.OPENAI_API_KEY
    ? createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_ENDPOINT,
      })
    : undefined;
  if (openai) {
    return openai('o3-mini', {
      reasoningEffort: 'medium',
      structuredOutputs: true,
    });
  }

  const anthropic = process.env.ANTHROPIC_API_KEY
    ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : undefined;
  if (anthropic) {
    return anthropic('claude-3-haiku-20240307');
  }


  const google = process.env.GOOGLE_API_KEY
    ? createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY })
    : undefined;
  if (google) {
    return google('gemini-1.0-pro-latest', {
      structuredOutputs: true,
    });
  }

  throw new Error(' No available LLM provider configured');
}





const MinChunkSize = 140;
const encoder = getEncoding('o200k_base');

export function trimPrompt(
  prompt: string,
  contextSize = Number(process.env.CONTEXT_SIZE) || 128_000,
): string {
  if (!prompt) return '';

  const length = encoder.encode(prompt).length;
  if (length <= contextSize) return prompt;

  const overflowTokens = length - contextSize;
  const chunkSize = prompt.length - overflowTokens * 3;
  if (chunkSize < MinChunkSize) return prompt.slice(0, MinChunkSize);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: 0,
  });
  const trimmed = splitter.splitText(prompt)[0] ?? '';

  if (trimmed.length === prompt.length) {
    return trimPrompt(prompt.slice(0, chunkSize), contextSize);
  }
  return trimPrompt(trimmed, contextSize);
}

