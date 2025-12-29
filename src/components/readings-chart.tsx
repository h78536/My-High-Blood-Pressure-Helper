'use client';

import type { BloodPressureReading } from '@/lib/definitions';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { AreaChart, CartesianGrid, XAxis, Area, Tooltip } from 'recharts';
import {
  ChartContainer,
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
      name: format(toDate(reading.timestamp), 'MMM d, p', { locale: zhCN }),
    }))
    .reverse(); // reverse to show oldest first

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value, index) => {
              if (chartData.length > 10 && index % Math.floor(chartData.length / 5) !== 0) {
                return '';
              }
              return value.split(',')[0];
            }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="systolic"
            type="monotone"
            fill="var(--color-systolic)"
            fillOpacity={0.4}
            stroke="var(--color-systolic)"
            stackId="1"
          />
          <Area
            dataKey="diastolic"
            type="monotone"
            fill="var(--color-diastolic)"
            fillOpacity={0.4}
            stroke="var(--color-diastolic)"
            stackId="2"
          />
           <Area
            dataKey="heartRate"
            type="monotone"
            fill="var(--color-heartRate)"
            fillOpacity={0.2}
            stroke="var(--color-heartRate)"
            stackId="3"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
