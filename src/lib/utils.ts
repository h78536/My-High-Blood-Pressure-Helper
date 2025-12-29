import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type BPCategory =
  | '正常'
  | '偏高'
  | '高血压1期'
  | '高血压2期'
  | '高血压危象';

export type BPCategoryInfo = {
  category: BPCategory;
  variant: 'secondary' | 'default' | 'destructive' | 'outline';
  description: string;
};

export function getBPCategory(systolic: number, diastolic: number): BPCategoryInfo {
  if (systolic > 180 || diastolic > 120) {
    return {
      category: '高血压危象',
      variant: 'destructive',
      description: '请立即寻求紧急医疗救助。'
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: '高血压2期',
      variant: 'destructive',
      description: '收缩压至少140或舒张压至少90 mm Hg。'
    };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return {
      category: '高血压1期',
      variant: 'default',
      description: '收缩压130-139或舒张压80-89 mm Hg。'
    };
  }
  if (systolic >= 120) {
    return {
      category: '偏高',
      variant: 'outline',
      description: '收缩压120-129且舒张压低于80 mm Hg。'
    };
  }
  return {
    category: '正常',
    variant: 'secondary',
    description: '收缩压低于120且舒张压低于80 mm Hg。'
  };
}