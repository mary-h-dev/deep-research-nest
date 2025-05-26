import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from './ai-providers';
import { systemPrompt } from './prompt';

export async function buildProfessionalQuestions(query: string): Promise<{
  questions: string[];
  formatted: string;
}> {
  const res = await generateObject({
    model: getModel(),
    system: systemPrompt(),
    prompt: `
You are a smart assistant helping users clarify their research needs.

1. First, detect the language of the user's message.
   - If it's in Persian, ask follow-up questions in **Persian**.
   - If it's in English, ask follow-up questions in **English**.

2. Based on the following query, generate **3 questions** that:
   - Help the user clarify what exactly they are looking for
   - Point to the intended **purpose** of the research (e.g. writing an article, making a decision, learning something)
   - Highlight their **priorities** (e.g. accuracy, speed, academic value, sources)

3. The tone should be polite, professional, and slightly friendly.
   - The questions should be suitable for both general users and experts.

User's query:
<query>${query}</query>`,
    schema: z.object({
      questions: z.array(
        z.object({
          question: z.string().describe('Question text'),
          purpose: z.string().describe('Purpose of this question'),
          expectedInsight: z.string().describe('Insight expected from the answer'),
        })
      ).length(3),
      researchCategory: z.enum([
        'technical_deep',
        'market_analysis', 
        'academic_research',
        'strategic_planning',
        'general_inquiry'
      ]).describe('Type of research category'),
    }),
  });

  const formatted = res.object.questions
    .map((q, i) => `${i + 1}. ${q.question}`)
    .join('\n');

  console.log('📋 Generated Questions:');
  res.object.questions.forEach((q, i) => {
    // console.log(`  ${i + 1}. ${q.question}`);
    // console.log(`     🎯 Purpose: ${q.purpose}`);
    // console.log(`     💡 Insight: ${q.expectedInsight}`);
  });
  console.log(`📊 Research Category: ${res.object.researchCategory}`);

  return {
    questions: res.object.questions.map(q => q.question),
    formatted,
  };
}

export async function analyzeAnswerQuality(
  questions: string[],
  answers: string[]
): Promise<{
  quality: 'low' | 'medium' | 'high';
  suggestions?: string[];
}> {
  const analysis = await generateObject({
    model: getModel(),
    system: systemPrompt(),
    prompt: `
Evaluate the quality of the following answers to the research questions:

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Assess the overall quality and provide suggestions for improvement if needed.
`,
    schema: z.object({
      quality: z.enum(['low', 'medium', 'high']),
      completeness: z.number().min(0).max(100).describe('Percentage of information completeness'),
      suggestions: z.array(z.string()).optional().describe('Suggestions for improving the answers'),
      missingAspects: z.array(z.string()).optional().describe('Aspects not covered in the answers'),
    }),
  });

  return {
    quality: analysis.object.quality,
    suggestions: analysis.object.suggestions,
  };
}

export async function generateFeedback({
  query,
  numQuestions = 3,
}: {
  query: string;
  numQuestions?: number;
}) {
  const result = await buildProfessionalQuestions(query);
  return result.questions.slice(0, numQuestions);
}

export async function buildMultiQuestion(query: string): Promise<string> {
  const result = await buildProfessionalQuestions(query);
  return result.formatted;
}
