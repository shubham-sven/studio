'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Mock OTP sending - in real app this would call an API
    const { users } = await import('../../lib/data');
    const userExists = users.some(user => user.email === email);

    if (userExists) {
      // Generate and store OTP (in real app, this would be sent via email/SMS)
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('resetOtp', generatedOtp);
      localStorage.setItem('resetEmail', email);
      setMessage(`OTP sent to ${email}. Please check your email.`);
      setStep('otp');
    } else {
      setError('No account found with this email address.');
    }

    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const storedOtp = localStorage.getItem('resetOtp');
    const storedEmail = localStorage.getItem('resetEmail');

    if (otp === storedOtp && storedEmail === email) {
      // OTP verified, redirect to reset password page
      router.push('/reset-password');
    } else {
      setError('Invalid OTP. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl font-bold text-primary">
            {step === 'email' ? 'Forgot Password' : 'Enter OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Enter your email address and we\'ll send you an OTP to reset your password.'
              : 'Enter the 6-digit OTP sent to your email.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="grid gap-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep('email')}
              >
                Back
              </Button>
            </form>
          )}
        </CardContent>
        <div className="text-center text-sm pb-4">
          Remember your password?{" "}
          <Link href="/login" className="underline font-semibold text-primary">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
