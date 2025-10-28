'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Truck, Edit, CheckCircle } from 'lucide-react';
import { Address, PaymentMethod } from '@/lib/data';
import { formatPrice } from '@/lib/payments';
import { useCart } from '@/context/cart-context';
import { getArtworkById } from '@/lib/data';

interface ReviewStepProps {
  selectedAddress: Address;
  selectedPaymentMethod: string;
  onEditAddress: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
  onBack: () => void;
}

export default function ReviewStep({
  selectedAddress,
  selectedPaymentMethod,
  onEditAddress,
  onEditPayment,
  onPlaceOrder,
  onBack,
}: ReviewStepProps) {
  const { cart } = useCart();

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'card':
        return { name: 'Credit/Debit Card', icon: CreditCard };
      case 'upi':
        return { name: 'UPI', icon: CreditCard };
      case 'netbanking':
        return { name: 'Net Banking', icon: CreditCard };
      case 'wallet':
        return { name: 'Wallet', icon: CreditCard };
      case 'cod':
        return { name: 'Cash on Delivery', icon: Truck };
      default:
        return { name: method, icon: CreditCard };
    }
  };

  const subtotal = cart?.items.reduce((total, item) => {
    const artwork = getArtworkById(item.artworkId);
    return total + (artwork ? item.quantity * artwork.price : 0);
  }, 0) || 0;

  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const paymentMethod = getPaymentMethodDisplay(selectedPaymentMethod);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Your Order</h3>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart?.items.map((item) => {
                const artwork = getArtworkById(item.artworkId);
                if (!artwork) return null;

                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{artwork.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(artwork.price * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onEditAddress}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedAddress.name}</span>
                <Badge variant="secondary" className="capitalize">
                  {selectedAddress.type}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
              </p>
              <p className="text-muted-foreground">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
              </p>
              <p className="text-muted-foreground">{selectedAddress.country}</p>
              <p className="text-muted-foreground">Phone: {selectedAddress.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <paymentMethod.icon className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onEditPayment}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <paymentMethod.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{paymentMethod.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPaymentMethod === 'cod'
                    ? 'Pay with cash when you receive your order'
                    : 'Secure payment via Razorpay'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({cart?.items.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                By placing this order, you agree to our{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                You can track your order status and manage returns through your account dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Payment
        </Button>
        <Button onClick={onPlaceOrder} size="lg" className="min-w-[200px]">
          Place Order • {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
}
