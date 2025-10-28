'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [orderId] = useState(`ORD-${Date.now()}`);

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              Order ID: {orderId}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
            <p className="text-sm text-muted-foreground">
              You can track your order status in your account dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/account">
              <Button className="w-full">
                View Order Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
