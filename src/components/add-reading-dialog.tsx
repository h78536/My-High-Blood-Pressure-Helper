'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, Timestamp } from 'firebase/firestore';

const ReadingSchema = z.object({
  systolic: z.coerce
    .number({ required_error: '收缩压是必填项。' })
    .int()
    .min(50, '必须大于等于 50')
    .max(300, '必须小于等于 300'),
  diastolic: z.coerce
    .number({ required_error: '舒张压是必填项。' })
    .int()
    .min(30, '必须大于等于 30')
    .max(200, '必须小于等于 200'),
  heartRate: z.coerce
    .number({ required_error: '心率是必填项。' })
    .int()
    .min(30, '必须大于等于 30')
    .max(250, '必须小于等于 250'),
});

type ReadingFormValues = z.infer<typeof ReadingSchema>;

export function AddReadingDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<ReadingFormValues>({
    resolver: zodResolver(ReadingSchema),
    defaultValues: {
      systolic: undefined,
      diastolic: undefined,
      heartRate: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (data: ReadingFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '您必须登录才能添加读数。',
      });
      return;
    }

    const readingsColRef = collection(firestore, 'users', user.uid, 'bloodPressureReadings');
    const readingData = {
        ...data,
        timestamp: Timestamp.now(),
        userId: user.uid,
    };
    
    addDocumentNonBlocking(readingsColRef, readingData);

    toast({
      title: '成功',
      description: '您的新读数已保存。',
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!user}>
          <Plus className="mr-2 h-4 w-4" /> 添加读数
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加新读数</DialogTitle>
          <DialogDescription>
            请输入您的收缩压、舒张压和心率值。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>收缩压 (SYS)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>舒张压 (DIA)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>心率 (BPM)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="72" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 正在保存...
                  </>
                ) : (
                  <>
                    保存读数 <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
