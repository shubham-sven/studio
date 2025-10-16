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
    <div className="w-full min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
         <Image
          src="https://picsum.photos/seed/117/1200/1800"
          alt="Abstract artwork"
          fill
          className="object-cover"
          data-ai-hint="surreal colors"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
                >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Artify
        </div>
        <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
                <p className="text-lg">
                &ldquo;This platform has been a game-changer for discovering new artists and acquiring unique digital art. The quality and variety are unparalleled.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-4">
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
                <div className="relative w-full">
                    <Separator className="absolute top-1/2 -translate-y-1/2" />
                    <p className="text-center bg-background px-2 text-xs text-muted-foreground">OR LOG IN AS</p>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => login('artist')}>
                    Login as Artist
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline font-semibold text-primary">
                    Sign up
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
