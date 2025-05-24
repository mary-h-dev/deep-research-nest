// Providers
import { createOpenAI } from '@ai-sdk/openai';
// import { createAnthropic } from '@ai-sdk/anthropic';
// import { createGoogle } from '@ai-sdk/google';
// import { createGroq } from '@ai-sdk/groq';

// AI SDK core
import {
  extractReasoningMiddleware,
  LanguageModelV1,
  wrapLanguageModel,
} from 'ai';

// Utils
import { getEncoding } from 'js-tiktoken';
import { RecursiveCharacterTextSplitter } from './text-splitter';


// -------------------
// Provider Enum
// -------------------
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  GROQ = 'groq',
}




// -------------------
// Provider Instances
// -------------------
const openai = process.env.OPENAI_API_KEY
  ? createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_ENDPOINT,
    })
  : undefined;


// const anthropic = process.env.ANTHROPIC_API_KEY
//   ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
//   : undefined;

// const google = process.env.GOOGLE_API_KEY
//   ? createGoogle({ apiKey: process.env.GOOGLE_API_KEY })
//   : undefined;

// const groq = process.env.GROQ_API_KEY
//   ? createGroq({ apiKey: process.env.GROQ_API_KEY })
//   : undefined;


// -------------------
// Model Map
// -------------------
const MODELS: Partial<Record<AIProvider, LanguageModelV1>> = {
  [AIProvider.OPENAI]: openai?.('o3-mini', {
    reasoningEffort: 'medium',
    structuredOutputs: true,
  }),
  // [AIProvider.ANTHROPIC]: anthropic?.('claude-3-haiku-20240307') as LanguageModelV1,
  // [AIProvider.GOOGLE]: google?.('gemini-1.0-pro-latest', { structuredOutputs: true }),
  // [AIProvider.GROQ]: groq?.('llama3-8b-8192', { structuredOutputs: true }),
};


// -------------------
// Model Selector
// -------------------
const PREFERRED_PROVIDER =
  (process.env.AI_PROVIDER as AIProvider | undefined) ?? AIProvider.OPENAI;

export function getModel(): LanguageModelV1 {
  if (openai) {
    return openai('gpt-3.5-turbo', {
      structuredOutputs: true,
    });
  }

  const selected = MODELS[PREFERRED_PROVIDER];
  if (selected) return selected;

  const fallback = Object.values(MODELS).find(Boolean);
  if (!fallback) throw new Error('❌ No available LLM provider configured');

  return fallback;
}


// -------------------
// Prompt Trimmer
// -------------------
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

  const trimmedPrompt = splitter.splitText(prompt)[0] ?? '';
  if (trimmedPrompt.length === prompt.length) {
    return trimPrompt(prompt.slice(0, chunkSize), contextSize);
  }

  return trimPrompt(trimmedPrompt, contextSize);
}
