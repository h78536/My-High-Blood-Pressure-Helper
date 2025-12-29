'use server';

import {
  collection,
  Timestamp,
  addDoc,
  getFirestore,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  BloodPressureReading,
  BloodPressureReadingForm,
} from './definitions';
import { generatePersonalizedInsights } from '@/ai/flows/generate-personalized-insights';
import { summarizeBPTrends } from '@/ai/flows/summarize-bp-trends.ts';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { initializeFirebase } from '@/firebase';


// This function is no longer using firebase-admin
export async function addReading(data: BloodPressureReadingForm, userId: string) {
  // This is a client-side action now, but we'll keep the structure
  // We cannot use firebase-admin on the client
  // The logic will be handled in the component instead.
  // This file remains for the AI-related server actions.
}

export async function getAiInsights(readings: BloodPressureReading[]) {
  if (readings.length < 5) {
    return { insights: "数据不足，无法进行全面分析。请至少添加5条读数以获得个性化见解。" };
  }
  
  const preparedData = {
    systolicReadings: readings.map(r => r.systolic),
    diastolicReadings: readings.map(r => r.diastolic),
    heartRates: readings.map(r => r.heartRate),
    readingTimes: readings.map(r => new Date(r.timestamp).toISOString()),
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
