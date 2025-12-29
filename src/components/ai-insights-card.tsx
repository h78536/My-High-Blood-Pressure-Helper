'use client';

import { useState } from 'react';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getAiInsights, getTrendSummary } from '@/lib/actions';
import type { BloodPressureReading } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AiInsightsCardProps {
  readings: BloodPressureReading[];
}

export default function AiInsightsCard({ readings }: AiInsightsCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('insights');
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setInsights(null);
    setSummary(null);
    try {
      const [insightsResult, summaryResult] = await Promise.all([
        getAiInsights(readings),
        getTrendSummary(readings, 'monthly')
      ]);

      if (insightsResult.error || summaryResult.error) {
        throw new Error(insightsResult.error || summaryResult.error);
      }

      setInsights(insightsResult.insights!);
      setSummary(summaryResult.summary!);

    } catch (error: any) {
      console.error('AI generation failed:', error);
      toast({
        variant: 'destructive',
        title: '分析失败',
        description: '无法连接到AI服务。请检查您的API密钥或稍后再试。',
      });
      // Optionally, still set a message in the card
      setInsights('无法生成分析。');
      setSummary('无法生成总结。');
    } finally {
      setIsLoading(false);
    }
  };

  const hasGenerated = insights || summary;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI 智能分析</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {!hasGenerated && !isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">获取个性化见解</h3>
            <p className="text-sm text-muted-foreground mb-4">
              分析您的读数以了解趋势并获得可行的建议。
            </p>
            <Button onClick={handleGenerate} disabled={readings.length === 0}>
              <Wand2 className="mr-2 h-4 w-4" />
              生成分析
            </Button>
          </div>
        )}
        {isLoading && (
          <div className="flex-grow flex items-center justify-center text-center p-4">
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <p>正在分析您的数据...</p>
            </div>
          </div>
        )}
        {hasGenerated && !isLoading && (
          <div className="flex flex-col h-full">
            <Tabs defaultValue="insights" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="insights">健康洞察</TabsTrigger>
                <TabsTrigger value="summary">趋势总结</TabsTrigger>
              </TabsList>
              <TabsContent value="insights" className="text-sm text-foreground mt-4 overflow-y-auto max-h-48 prose prose-sm dark:prose-invert prose-p:leading-relaxed">
                <p>{insights}</p>
              </TabsContent>
              <TabsContent value="summary" className="text-sm text-foreground mt-4 overflow-y-auto max-h-48 prose prose-sm dark:prose-invert prose-p:leading-relaxed">
                <p>{summary}</p>
              </TabsContent>
            </Tabs>
            <div className="mt-auto pt-4">
              <Button onClick={handleGenerate} variant="outline" size="sm" className="w-full">
                <Wand2 className="mr-2 h-4 w-4" />
                重新生成分析
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
