'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription>
                Enter your email below to login to your account
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
                <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" onClick={() => login('buyer')}>
                Login
            </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline font-semibold text-primary">
                    Sign up
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
