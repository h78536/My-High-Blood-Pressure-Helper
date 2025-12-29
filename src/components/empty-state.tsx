import { AddReadingDialog } from './add-reading-dialog';

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <h3 className="font-headline text-2xl font-bold tracking-tight">
          暂无读数
        </h3>
        <p className="text-sm text-muted-foreground">
          添加您的第一个血压读数以开始使用。
        </p>
        <AddReadingDialog />
      </div>
    </div>
  );
}
