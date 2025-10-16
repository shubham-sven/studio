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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export default function SignupPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<'buyer' | 'artist'>('buyer');

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[380px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary">Create an Account</h1>
                <p className="text-balance text-muted-foreground">
                    Join Artify to discover, buy, and sell digital art.
                </p>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" placeholder="Max Robinson" required />
                </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
                 <div className="space-y-2">
                    <Label>I want to:</Label>
                    <RadioGroup
                    defaultValue="buyer"
                    className="grid grid-cols-2 gap-4"
                    onValueChange={(value) => setRole(value as 'buyer' | 'artist')}
                    >
                    <div>
                        <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                        <Label
                        htmlFor="buyer"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        Buy Art
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem
                        value="artist"
                        id="artist"
                        className="peer sr-only"
                        />
                        <Label
                        htmlFor="artist"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        Sell Art
                        </Label>
                    </div>
                    </RadioGroup>
                </div>
                <Button type="submit" className="w-full" onClick={() => login(role)}>
                    Create an account
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline font-semibold text-primary">
                    Login
                </Link>
            </div>
            </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image
          src="https://picsum.photos/seed/105/1200/1800"
          alt="Abstract artwork"
          fill
          className="object-cover"
          data-ai-hint="digital art"
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
                &ldquo;Selling my work on this platform has been a revelation. It connects me directly with collectors who appreciate my unique style.&rdquo;
                </p>
                <footer className="text-sm">Elena Petrova</footer>
            </blockquote>
        </div>
      </div>
    </div>
  );
}
