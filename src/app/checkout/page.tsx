'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Address, getArtworkById } from '@/lib/data';
import { formatPrice } from '@/lib/payments';
import CheckoutProgress from '@/components/checkout/checkout-progress';
import AddressStep from '@/components/checkout/address-step';
import PaymentStep from '@/components/checkout/payment-step';
import ReviewStep from '@/components/checkout/review-step';
import ConfirmationStep from '@/components/checkout/confirmation-step';
import Script from 'next/script';

type CheckoutStep = 'address' | 'payment' | 'review' | 'confirmation';
type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Payment details state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [upiId, setUpiId] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [walletType, setWalletType] = useState('');

  // Load saved checkout state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('checkout-state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
          if (parsed.selectedAddress) setSelectedAddress(parsed.selectedAddress);
          if (parsed.selectedPaymentMethod) setSelectedPaymentMethod(parsed.selectedPaymentMethod);
          if (parsed.orderId) setOrderId(parsed.orderId);
          if (parsed.cardDetails) setCardDetails(parsed.cardDetails);
          if (parsed.upiId) setUpiId(parsed.upiId);
          if (parsed.bankCode) setBankCode(parsed.bankCode);
          if (parsed.walletType) setWalletType(parsed.walletType);
        } catch (error) {
          console.error('Failed to parse saved checkout state:', error);
        }
      }
    }
  }, []);

  // Save checkout state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        currentStep,
        selectedAddress,
        selectedPaymentMethod,
        orderId,
        cardDetails,
        upiId,
        bankCode,
        walletType,
      };
      localStorage.setItem('checkout-state', JSON.stringify(stateToSave));
    }
  }, [currentStep, selectedAddress, selectedPaymentMethod, orderId, cardDetails, upiId, bankCode, walletType]);

  // Clear saved checkout state when order is completed
  const clearSavedCheckoutState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkout-state');
    }
  };

  const steps = ['Address', 'Payment', 'Review', 'Confirmation'];
  const currentStepIndex = steps.findIndex(step =>
    step.toLowerCase() === currentStep
  ) + 1;

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push('/cart');
    }
    if (user.role === 'guest') {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to checkout.',
      });
      router.push('/login');
    }
  }, [cart, user, router, toast]);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handlePaymentMethodSelect = (method: PaymentMethodType) => {
    setSelectedPaymentMethod(method);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'address':
        if (selectedAddress) {
          setCurrentStep('payment');
        }
        break;
      case 'payment':
        setCurrentStep('review');
        break;
      case 'review':
        handlePlaceOrder();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'payment':
        setCurrentStep('address');
        break;
      case 'review':
        setCurrentStep('payment');
        break;
    }
  };

  const handleEditAddress = () => {
    setCurrentStep('address');
  };

  const handleEditPayment = () => {
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      const totalAmount = cart.items.reduce((total, item) => {
        const artwork = getArtworkById(item.artworkId);
        return total + (artwork ? item.quantity * artwork.price : 0);
      }, 0);

      // Generate order ID first
      const generatedOrderId = `ORD-${Date.now()}`;
      setOrderId(generatedOrderId);

      // Create order in database
      const orderData = {
        userId: user.id,
        items: cart.items.map(item => ({
          artworkId: item.artworkId,
          quantity: item.quantity,
        })),
        subtotal: totalAmount,
        tax: totalAmount * 0.18,
        shipping: totalAmount > 500 ? 0 : 50,
        discount: 0,
        total: totalAmount * 1.18 + (totalAmount > 500 ? 0 : 50),
        currency: 'INR',
        paymentMethod: selectedPaymentMethod,
        shippingAddress: selectedAddress,
        billingAddress: selectedAddress,
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderResult = await orderResponse.json();

      if (selectedPaymentMethod === 'cod') {
        // COD - simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Send order confirmation notification
        toast({
          title: 'Order Confirmed!',
          description: `Your order ${generatedOrderId} has been placed successfully.`,
        });

        await clearCart();
        clearSavedCheckoutState();
        setCurrentStep('confirmation');
      } else {
        // Use Razorpay for other payment methods
        const response = await fetch('/api/razorpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'INR',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment order');
        }

        // Initialize Razorpay checkout
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'Artify',
          description: 'Art Purchase',
          handler: async function (response: any) {
            // Verify payment on server
            const verifyResponse = await fetch('/api/razorpay', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              // Send order confirmation notification
              toast({
                title: 'Order Confirmed!',
                description: `Your order ${generatedOrderId} has been placed successfully. Payment received.`,
              });

              await clearCart();
              clearSavedCheckoutState();
              setCurrentStep('confirmation');
            } else {
              throw new Error('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#3b82f6',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Order processing failed.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'address':
        return (
          <AddressStep
            selectedAddress={selectedAddress}
            onAddressSelect={handleAddressSelect}
            onNext={handleNext}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            onNext={handleNext}
            onBack={handleBack}
            totalAmount={cart.items.reduce((total, item) => {
              const artwork = getArtworkById(item.artworkId);
              return total + (artwork ? item.quantity * artwork.price : 0);
            }, 0)}
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            upiId={upiId}
            setUpiId={setUpiId}
            bankCode={bankCode}
            setBankCode={setBankCode}
            walletType={walletType}
            setWalletType={setWalletType}
          />
        );
      case 'review':
        return (
          <ReviewStep
            selectedAddress={selectedAddress!}
            selectedPaymentMethod={selectedPaymentMethod}
            onEditAddress={handleEditAddress}
            onEditPayment={handleEditPayment}
            onPlaceOrder={handleNext}
            onBack={handleBack}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStep
            orderId={orderId}
            selectedAddress={selectedAddress!}
            selectedPaymentMethod={selectedPaymentMethod}
            totalAmount={cart.items.reduce((total, item) => {
              const artwork = getArtworkById(item.artworkId);
              return total + (artwork ? item.quantity * artwork.price : 0);
            }, 0)}
            estimatedDelivery={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            onContinueShopping={handleContinueShopping}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            {currentStep !== 'confirmation' && (
              <CheckoutProgress
                currentStep={currentStepIndex}
                steps={steps.slice(0, 3)}
              />
            )}

            {/* Step Content */}
            <div className="mt-8">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
