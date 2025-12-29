import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import type { BloodPressureReading } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { BPCategoryBadge } from './bp-category-badge';
import { Heart } from 'lucide-react';

interface LatestReadingCardProps {
  reading: BloodPressureReading;
}

function toDate(timestamp: any): Date {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}

export default function LatestReadingCard({ reading }: LatestReadingCardProps) {
  const readingDate = toDate(reading.timestamp);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>最近一次读数</CardTitle>
        <CardDescription>
          记录于 {formatDistanceToNow(readingDate, { addSuffix: true, locale: zhCN })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold md:text-5xl">{reading.systolic}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-4xl font-bold md:text-5xl">{reading.diastolic}</span>
            </div>
            <p className="text-sm text-muted-foreground">收缩压 / 舒张压 (mmHg)</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
             <BPCategoryBadge systolic={reading.systolic} diastolic={reading.diastolic} />
            <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
              <Heart className="h-5 w-5 text-destructive" />
              <span>{reading.heartRate}</span>
              <span className="text-sm font-normal">BPM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
