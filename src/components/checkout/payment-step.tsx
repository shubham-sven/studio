'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Building2, Truck, Wallet, Star, Plus } from 'lucide-react';
import { PaymentMethod } from '@/lib/data';
import { formatPrice } from '@/lib/payments';

type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

interface PaymentStepProps {
  selectedPaymentMethod: PaymentMethodType;
  onPaymentMethodSelect: (method: PaymentMethodType) => void;
  onNext: () => void;
  onBack: () => void;
  totalAmount: number;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
    saveCard?: boolean;
  };
  setCardDetails: React.Dispatch<React.SetStateAction<{
    number: string;
    expiry: string;
    cvv: string;
    name: string;
    saveCard?: boolean;
  }>>;
  upiId: string;
  setUpiId: React.Dispatch<React.SetStateAction<string>>;
  bankCode: string;
  setBankCode: React.Dispatch<React.SetStateAction<string>>;
  walletType: string;
  setWalletType: React.Dispatch<React.SetStateAction<string>>;
}

export default function PaymentStep({
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onNext,
  onBack,
  totalAmount,
  cardDetails,
  setCardDetails,
  upiId,
  setUpiId,
  bankCode,
  setBankCode,
  walletType,
  setWalletType,
}: PaymentStepProps) {
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  // Mock saved payment methods with enhanced data
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm-1',
      userId: 'user-123',
      type: 'card',
      provider: 'visa',
      last4: '4242',
      maskedNumber: '•••• •••• •••• 4242',
      expiryMonth: 12,
      expiryYear: 2025,
      nickname: 'Personal Visa',
      isDefault: true,
      isVerified: true,
      emiEligible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pm-2',
      userId: 'user-123',
      type: 'upi',
      provider: 'gpay',
      upiId: 'user@okicici',
      nickname: 'Google Pay',
      isDefault: false,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pm-3',
      userId: 'user-123',
      type: 'card',
      provider: 'mastercard',
      last4: '8888',
      maskedNumber: '•••• •••• •••• 8888',
      expiryMonth: 6,
      expiryYear: 2026,
      nickname: 'Rewards Card',
      isDefault: false,
      isVerified: true,
      emiEligible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const paymentOptions = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      available: true,
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Paytm, Google Pay, PhonePe, BHIM UPI',
      available: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks',
      available: true,
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: Wallet,
      description: 'Paytm, Mobikwik, Ola Money',
      available: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Truck,
      description: 'Pay when you receive',
      available: totalAmount <= 50000, // COD limit
    },
  ];

  const walletOptions = [
    { id: 'paytm', name: 'Paytm', icon: '💰' },
    { id: 'gpay', name: 'Google Pay', icon: '🎯' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'amazonpay', name: 'Amazon Pay', icon: '📦' },
  ];

  const bankOptions = [
    { code: 'sbi', name: 'State Bank of India' },
    { code: 'hdfc', name: 'HDFC Bank' },
    { code: 'icici', name: 'ICICI Bank' },
    { code: 'axis', name: 'Axis Bank' },
    { code: 'pnb', name: 'Punjab National Bank' },
  ];

  const handleSaveCard = () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      userId: 'user-123',
      type: 'card',
      provider: cardDetails.number.startsWith('4') ? 'visa' : cardDetails.number.startsWith('5') ? 'mastercard' : 'rupay',
      last4: cardDetails.number.slice(-4),
      isDefault: savedPaymentMethods.length === 0,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavedPaymentMethods(prev => [...prev, newPaymentMethod]);
    setShowNewCardForm(false);
    setCardDetails({ number: '', expiry: '', cvv: '', name: '', saveCard: false });
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return (
          <div className="space-y-6">
            {/* Saved Cards */}
            <div className="space-y-3">
              <h4 className="font-medium">Saved Cards</h4>
              {savedPaymentMethods.filter(pm => pm.type === 'card').map((card) => (
                <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">•••• •••• •••• {card.last4}</p>
                          <p className="text-sm text-muted-foreground capitalize">{card.provider} Card</p>
                        </div>
                      </div>
                      {card.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* New Card Form */}
            {!showNewCardForm ? (
              <Button
                variant="outline"
                onClick={() => setShowNewCardForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Card
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Card</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={cardDetails.saveCard}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, saveCard: e.target.checked }))}
                    />
                    <Label htmlFor="saveCard">Save card for future payments</Label>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveCard} className="flex-1">
                      Save Card
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewCardForm(false);
                        setCardDetails({ number: '', expiry: '', cvv: '', name: '', saveCard: false });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            {/* Saved UPI IDs */}
            <div className="space-y-3">
              <h4 className="font-medium">Saved UPI IDs</h4>
              {savedPaymentMethods.filter(pm => pm.type === 'upi').map((upi) => (
                <Card key={upi.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{upi.upiId}</p>
                          <p className="text-sm text-muted-foreground capitalize">{upi.provider}</p>
                        </div>
                      </div>
                      {upi.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div>
              <Label htmlFor="upiId">Enter UPI ID</Label>
              <Input
                id="upiId"
                placeholder="user@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your UPI ID (e.g., user@paytm, user@ybl)
              </p>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankCode">Select Your Bank</Label>
              <select
                id="bankCode"
                className="w-full p-2 border rounded-md"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              >
                <option value="">Choose your bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Wallet</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {walletOptions.map((wallet) => (
                  <Card
                    key={wallet.id}
                    className={`cursor-pointer transition-all ${
                      walletType === wallet.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setWalletType(wallet.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{wallet.icon}</div>
                      <p className="font-medium">{wallet.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="text-center py-6">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Pay with cash when your order is delivered to your doorstep.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Additional delivery charges may apply.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>

        {/* Payment Method Options */}
        <div className="space-y-3 mb-6">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === option.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:shadow-md'
                } ${!option.available ? 'opacity-50' : ''}`}
                onClick={() => option.available && onPaymentMethodSelect(option.id as PaymentMethodType)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    {!option.available && (
                      <Badge variant="secondary">Not Available</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Form */}
        {selectedPaymentMethod && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {paymentOptions.find(opt => opt.id === selectedPaymentMethod)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderPaymentForm()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(totalAmount * 0.18)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalAmount * 1.18)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'card' && !cardDetails.number) || (selectedPaymentMethod === 'upi' && !upiId) || (selectedPaymentMethod === 'netbanking' && !bankCode) || (selectedPaymentMethod === 'wallet' && !walletType)}
          size="lg"
        >
          Review Order
        </Button>
      </div>
    </div>
  );
}
