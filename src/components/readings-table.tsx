import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BloodPressureReading } from '@/lib/definitions';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { BPCategoryBadge } from './bp-category-badge';

interface ReadingsTableProps {
  data: BloodPressureReading[];
}

function toDate(timestamp: any): Date {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}

export function ReadingsTable({ data }: ReadingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日期</TableHead>
            <TableHead className="text-center">收缩压</TableHead>
            <TableHead className="text-center">舒张压</TableHead>
            <TableHead className="text-center">心率</TableHead>
            <TableHead className="text-right">分类</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(reading => {
            const readingDate = toDate(reading.timestamp);
            return (
              <TableRow key={reading.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{format(readingDate, 'yyyy-MM-dd')}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(readingDate, 'p', { locale: zhCN })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{reading.systolic}</TableCell>
                <TableCell className="text-center">{reading.diastolic}</TableCell>
                <TableCell className="text-center">{reading.heartRate}</TableCell>
                <TableCell className="text-right">
                  <BPCategoryBadge
                    systolic={reading.systolic}
                    diastolic={reading.diastolic}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
