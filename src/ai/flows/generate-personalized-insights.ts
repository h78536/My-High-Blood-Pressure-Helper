'use server';

/**
 * @fileOverview Analyzes blood pressure readings and provides personalized insights.
 * 
 * - generatePersonalizedInsights - A function that generates personalized insights based on blood pressure readings.
 * - GeneratePersonalizedInsightsInput - The input type for the generatePersonalizedInsights function.
 * - GeneratePersonalizedInsightsOutput - The return type for the generatePersonalizedInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedInsightsInputSchema = z.object({
  systolicReadings: z.array(z.number()).describe('收缩压读数数组。'),
  diastolicReadings: z.array(z.number()).describe('舒张压读数数组。'),
  heartRates: z.array(z.number()).describe('心率读数数组。'),
  readingTimes: z.array(z.string()).describe('与血压读数对应的读数时间数组。'),
  userLifestyle: z
    .string()
    .optional()
    .describe(
      '可选的用户生活方式描述，包括饮食、锻炼习惯和其他相关信息。'
    ),
});
export type GeneratePersonalizedInsightsInput = z.infer<typeof GeneratePersonalizedInsightsInputSchema>;

const GeneratePersonalizedInsightsOutputSchema = z.object({
  insights: z.string().describe('基于血压读数的个性化见解。'),
});
export type GeneratePersonalizedInsightsOutput = z.infer<typeof GeneratePersonalizedInsightsOutputSchema>;

export async function generatePersonalizedInsights(
  input: GeneratePersonalizedInsightsInput
): Promise<GeneratePersonalizedInsightsOutput> {
  return generatePersonalizedInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedInsightsPrompt',
  input: {schema: GeneratePersonalizedInsightsInputSchema},
  output: {schema: GeneratePersonalizedInsightsOutputSchema},
  prompt: `你是一位专注于血压分析的健康专家。请用中文回答。

你将分析提供的血压读数、心率、读数时间和用户生活方式，以提供个性化的见解。

收缩压读数: {{{systolicReadings}}}
舒张压读数: {{{diastolicReadings}}}
心率: {{{heartRates}}}
读数时间: {{{readingTimes}}}
用户生活方式: {{{userLifestyle}}}

根据这些信息，提供管理他们健康的见解和建议。考虑潜在的健康风险或生活方式调整。请具体并具有可操作性。见解应简短且可操作，例如，如果读数在服药时间持续偏高，提醒用户服药。
`, // eslint-disable-line indent
});

const generatePersonalizedInsightsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedInsightsFlow',
    inputSchema: GeneratePersonalizedInsightsInputSchema,
    outputSchema: GeneratePersonalizedInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
