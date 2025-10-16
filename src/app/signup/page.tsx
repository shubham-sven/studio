'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export default function SignupPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<'buyer' | 'artist'>('buyer');

  return (
     <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-accent/10 to-background">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-4xl font-bold text-primary">Create an Account</CardTitle>
                <CardDescription>
                    Join Artify to discover, buy, and sell digital art.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="Max" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Robinson" required />
                    </div>
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
                 <div className="space-y-3">
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
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline font-semibold text-primary">
                      Login
                  </Link>
                </div>
            </CardContent>
        </Card>
      </div>
  );
}
