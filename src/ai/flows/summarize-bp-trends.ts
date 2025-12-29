'use server';
/**
 * @fileOverview Provides a summary of blood pressure trends over a specified period.
 *
 * - summarizeBPTrends - A function that summarizes blood pressure trends.
 * - SummarizeBPTrendsInput - The input type for the summarizeBPTrends function.
 * - SummarizeBPTrendsInput - The return type for the summarizeBPTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBPTrendsInputSchema = z.object({
  timePeriod: z
    .string()
    .describe("总结血压趋势的时间段（例如，'weekly'（每周），'monthly'（每月））。"),
  systolicReadings: z.array(z.number()).describe('收缩压读数数组。'),
  diastolicReadings: z.array(z.number()).describe('舒张压读数数组。'),
  heartRates: z.array(z.number()).describe('心率读数数组。'),
});
export type SummarizeBPTrendsInput = z.infer<typeof SummarizeBPTrendsInputSchema>;

const SummarizeBPTrendsOutputSchema = z.object({
  summary: z.string().describe('指定时间段内血压趋势的摘要。'),
});
export type SummarizeBPTrendsOutput = z.infer<typeof SummarizeBPTrendsOutputSchema>;

export async function summarizeBPTrends(input: SummarizeBPTrendsInput): Promise<SummarizeBPTrendsOutput> {
  return summarizeBPTrendsFlow(input);
}

const summarizeBPTrendsPrompt = ai.definePrompt({
  name: 'summarizeBPTrendsPrompt',
  input: {schema: SummarizeBPTrendsInputSchema},
  output: {schema: SummarizeBPTrendsOutputSchema},
  prompt: `你是一位分析血压趋势的医学专家。请用中文回答。

  总结指定时间段内的血压趋势。
  提供关于收缩压、舒张压和心率读数随时间变化的见解。

  时间段: {{{timePeriod}}}
  收缩压读数: {{{systolicReadings}}}
  舒张压读数: {{{diastolicReadings}}}
  舒张压读数: {{{diastolicReadings}}}
  心率: {{{heartRates}}}
  `,
});

const summarizeBPTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeBPTrendsFlow',
    inputSchema: SummarizeBPTrendsInputSchema,
    outputSchema: SummarizeBPTrendsOutputSchema,
  },
  async input => {
    const {output} = await summarizeBPTrendsPrompt(input);
    return output!;
  }
);
