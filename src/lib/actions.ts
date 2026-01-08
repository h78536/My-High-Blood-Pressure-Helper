'use server';

import {
  BloodPressureReading,
} from './definitions';
import { generatePersonalizedInsights } from '@/ai/flows/generate-personalized-insights';
import { summarizeBPTrends } from '@/ai/flows/summarize-bp-trends';


export async function getAiInsights(readings: BloodPressureReading[]) {
  if (readings.length < 5) {
    return { insights: "数据不足，无法进行全面分析。请至少添加5条读数以获得个性化见解。" };
  }
  
  const preparedData = {
    systolicReadings: readings.map(r => r.systolic),
    diastolicReadings: readings.map(r => r.diastolic),
    heartRates: readings.map(r => r.heartRate),
    readingTimes: readings.map(r => (r.timestamp as any)?.toDate ? (r.timestamp as any).toDate().toISOString() : new Date(r.timestamp).toISOString()),
  };
  
  try {
    const result = await generatePersonalizedInsights(preparedData);
    return { insights: result.insights };
  } catch (error) {
    console.error('AI Insight Error:', error);
    return { error: '目前无法生成AI见解。' };
  }
}

export async function getTrendSummary(readings: BloodPressureReading[], timePeriod: 'weekly' | 'monthly') {
  if (readings.length < 2) {
    return { summary: "数据不足，无法总结趋势。请添加更多读数。" };
  }

  const preparedData = {
    timePeriod,
    systolicReadings: readings.map(r => r.systolic),
    diastolicReadings: readings.map(r => r.diastolic),
    heartRates: readings.map(r => r.heartRate),
  };

  try {
    const result = await summarizeBPTrends(preparedData);
    return { summary: result.summary };
  } catch (error) {
    console.error('AI Trend Summary Error:', error);
    return { error: '目前无法生成趋势总结。' };
  }
}
