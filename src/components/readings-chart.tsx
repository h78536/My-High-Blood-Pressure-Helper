'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import type { BloodPressureReading } from '@/lib/definitions';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';


interface ReadingsChartProps {
  data: BloodPressureReading[];
}

function toDate(timestamp: any): Date {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}


export function ReadingsChart({ data }: ReadingsChartProps) {
  const chartData = data
    .map(reading => ({
      ...reading,
      timestamp: toDate(reading.timestamp),
      name: format(toDate(reading.timestamp), 'MMM d, p', { locale: zhCN }),
    }))
    .reverse(); // reverse to show oldest first

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value, index) => {
              if (chartData.length > 10 && index % Math.floor(chartData.length / 5) !== 0) {
                return '';
              }
              return value.split(',')[0];
            }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
            labelStyle={{
                color: 'hsl(var(--foreground))'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Area
            type="monotone"
            dataKey="systolic"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={false}
            name="收缩压"
          />
          <Area
            type="monotone"
            dataKey="diastolic"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0-2}
            strokeWidth={2}
            dot={false}
            name="舒张压"
          />
          <Area
            type="monotone"
            dataKey="heartRate"
            stroke="hsl(var(--chart-3))"
            fill="hsl(var(--chart-3))"
            fillOpacity={0.1}
            strokeWidth={2}
            name="心率"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
