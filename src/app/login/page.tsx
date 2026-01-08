
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signInSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // This state ensures that we don't check for user until the client has hydrated.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (isClient && !isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router, isClient]);

  if (!isClient || isUserLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleSignIn = async (data: SignInFormValues) => {
    if (!auth) return;
    setIsLoading(true);
    setLoginError(null);
    
    const sharedPassword = 'linghu';

    try {
      // First, try to sign in.
      await signInWithEmailAndPassword(auth, data.email, sharedPassword);
      router.push('/');
    } catch (err: any) {
      // If sign-in fails because the user doesn't exist, create the account.
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, data.email, sharedPassword);
          toast({
            title: '账户已创建',
            description: '已为您自动登录。',
          });
          // The onAuthStateChanged listener in the provider will handle the redirect.
          router.push('/');
        } catch (creationError: any) {
          setLoginError('无法创建您的账户，请稍后再试。');
        }
      } else {
        // Handle other sign-in errors
        setLoginError('登录失败，请检查您的邮箱地址。');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <HeartPulse className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">欢迎使用血压监测</h1>
            <p className="text-muted-foreground">输入您的邮箱和统一密码即可登录</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>登录</CardTitle>
              <CardDescription>
                首次使用时，输入邮箱后会自动为您创建账户。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {loginError && <p className="text-sm font-medium text-destructive">{loginError}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    登录 / 注册
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // This will be rendered if user is logged in, but just for a moment before redirecting
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
