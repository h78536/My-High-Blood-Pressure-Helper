import { Badge } from '@/components/ui/badge';
import { getBPCategory } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BPCategoryBadgeProps {
  systolic: number;
  diastolic: number;
}

export function BPCategoryBadge({ systolic, diastolic }: BPCategoryBadgeProps) {
  const { category, variant, description } = getBPCategory(systolic, diastolic);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="cursor-default">{category}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
