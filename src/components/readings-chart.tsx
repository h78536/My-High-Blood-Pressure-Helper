'use client';

import type { BloodPressureReading } from '@/lib/definitions';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { AreaChart, CartesianGrid, XAxis, Area, Tooltip as RechartsTooltip, Legend, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';

interface ReadingsChartProps {
  data: BloodPressureReading[];
}

function toDate(timestamp: any): Date {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
}

const chartConfig = {
  systolic: {
    label: '收缩压',
    color: 'hsl(var(--chart-1))',
  },
  diastolic: {
    label: '舒张压',
    color: 'hsl(var(--chart-2))',
  },
  heartRate: {
    label: '心率',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function ReadingsChart({ data }: ReadingsChartProps) {
  const chartData = data
    .map(reading => ({
      ...reading,
      timestamp: toDate(reading.timestamp),
      name: format(toDate(reading.timestamp), 'MMM d', { locale: zhCN }),
    }))
    .reverse(); // reverse to show oldest first

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent 
            indicator="dot" 
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const item = payload[0];
                try {
                  return format(new Date(item.payload.timestamp), 'yyyy-MM-dd HH:mm', { locale: zhCN });
                } catch(e) {
                  return label;
                }
              }
              return label;
            }}
          />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <defs>
          <linearGradient id="fillSystolic" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-systolic)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-systolic)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillDiastolic" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-diastolic)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-diastolic)"
              stopOpacity={0.1}
            />
          </linearGradient>
           <linearGradient id="fillHeartRate" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-heartRate)"
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor="var(--color-heartRate)"
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="systolic"
          type="natural"
          fill="url(#fillSystolic)"
          fillOpacity={1}
          stroke="var(--color-systolic)"
          stackId="1"
        />
        <Area
          dataKey="diastolic"
          type="natural"
          fill="url(#fillDiastolic)"
          fillOpacity={1}
          stroke="var(--color-diastolic)"
          stackId="2"
        />
         <Area
          dataKey="heartRate"
          type="natural"
          fill="url(#fillHeartRate)"
          fillOpacity={1}
          stroke="var(--color-heartRate)"
          stackId="3"
        />
      </AreaChart>
    </ChartContainer>
  );
}
