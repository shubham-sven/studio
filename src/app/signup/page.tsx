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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const { users } = await import('../../lib/data');
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }

    // Create new user (in real app, this would be an API call)
    const newUser = {
      id: `user-${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      password,
      role,
      avatarId: role === 'artist' ? '1025' : '1015',
      bio: role === 'artist' ? 'New artist on Artify' : 'Art enthusiast and collector',
      joinedDate: new Date().toISOString(),
    };

    // Add to users array (in real app, this would be saved to database)
    users.push(newUser);

    // Update userCredentials
    const { userCredentials } = await import('../../lib/data');
    userCredentials[email] = { password, role };

    // Auto-login after signup
    const success = await login(email, password);
    if (!success) {
      setError('Account created but login failed. Please try logging in manually.');
    }

    setLoading(false);
  };

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
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input
                              id="first-name"
                              placeholder="Max"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input
                              id="last-name"
                              placeholder="Robinson"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
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
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create an account'}
                    </Button>
                </form>
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
