
'use client';

import { AddReadingDialog } from '@/components/add-reading-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AiInsightsCard from '@/components/ai-insights-card';
import LatestReadingCard from '@/components/latest-reading-card';
import { EmptyState } from '@/components/empty-state';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useAuth, useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useEffect } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import type { BloodPressureReading } from '@/lib/definitions';
import dynamic from 'next/dynamic';
import { ReadingsTable } from '@/components/readings-table';

// Temporarily disable the chart to solve the build issue.
// const ReadingsChart = dynamic(() => import('@/components/readings-chart').then(mod => mod.ReadingsChart), {
//   ssr: false,
//   loading: () => (
//     <div className="flex h-[350px] w-full items-center justify-center">
//       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//     </div>
//   ),
// });

export default function DashboardPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'bloodPressureReadings'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: readings, isLoading: areReadingsLoading } = useCollection<BloodPressureReading>(readingsQuery);
  
  const isLoading = isUserLoading || (areReadingsLoading && !readings);
  const sortedReadings = readings || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">正在加载您的健康数据...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
            血压监测
          </h1>
        </div>
        <div className="ml-auto">
          <AddReadingDialog />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {sortedReadings.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-4">
            {/* The chart has been temporarily removed to fix the build. */}
            {/* <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>血压趋势</CardTitle>
                </CardHeader>
                <CardContent className="pl-0 md:pl-2">
                   <ReadingsChart data={sortedReadings} />
                </CardContent>
              </Card>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:col-span-4">
                <LatestReadingCard reading={sortedReadings[0]} />
                <AiInsightsCard readings={sortedReadings} />
            </div>
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>历史记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReadingsTable data={sortedReadings} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
