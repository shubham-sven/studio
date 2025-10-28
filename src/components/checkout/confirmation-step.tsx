'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Clock } from 'lucide-react';
import { Address } from '@/lib/data';
import { formatPrice } from '@/lib/payments';

interface ConfirmationStepProps {
  orderId: string;
  selectedAddress: Address;
  selectedPaymentMethod: string;
  totalAmount: number;
  estimatedDelivery: string;
  onContinueShopping: () => void;
}

export default function ConfirmationStep({
  orderId,
  selectedAddress,
  selectedPaymentMethod,
  totalAmount,
  estimatedDelivery,
  onContinueShopping,
}: ConfirmationStepProps) {
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI';
      case 'netbanking':
        return 'Net Banking';
      case 'wallet':
        return 'Wallet';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. Your artwork is on its way!
        </p>
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order ID</span>
            <Badge variant="secondary" className="font-mono">
              {orderId}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order Date</span>
            <span>{new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-semibold">{formatPrice(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-muted-foreground">{estimatedDelivery}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <div className="text-muted-foreground text-sm">
                <p>{selectedAddress.name}</p>
                <p>{selectedAddress.addressLine1}</p>
                {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                <p>{selectedAddress.country}</p>
                <p>Phone: {selectedAddress.phone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="text-muted-foreground">{getPaymentMethodDisplay(selectedPaymentMethod)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">Your order has been confirmed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-muted-foreground">We're preparing your artwork</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="font-medium">Out for Delivery</p>
                <p className="text-sm text-muted-foreground">Expected by {estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>• You'll receive an email confirmation with your order details</p>
            <p>• Track your order status in your account dashboard</p>
            <p>• Our artist will start working on your custom artwork</p>
            <p>• You'll receive updates on the creation process</p>
            <p>• Delivery updates will be sent via SMS and email</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={onContinueShopping} className="flex-1">
          Continue Shopping
        </Button>
        <Button variant="outline" className="flex-1">
          View Order Details
        </Button>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Need help? Contact our support team at support@artgallery.com</p>
      </div>
    </div>
  );
}
