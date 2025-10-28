import Razorpay from 'razorpay';

// Initialize Razorpay only if keys are available
let razorpay: Razorpay | null = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

// Mock payment processing for development
export const createPaymentIntent = async (amount: number, currency = 'usd'): Promise<PaymentIntent> => {
  // In production, this would call your backend API
  // For now, return mock data
  return {
    id: `pi_mock_${Date.now()}`,
    client_secret: `pi_mock_secret_${Date.now()}`,
    amount,
    currency,
    status: 'requires_payment_method',
  };
};

export const createCheckoutSession = async (
  items: { artworkId: string; price: number; title: string; quantity: number }[],
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> => {
  // In production, this would call your backend API
  // For now, simulate real payment processing
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment processing (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      // Redirect to success page
      window.location.href = successUrl;
      return {
        id: `cs_real_${Date.now()}`,
        url: successUrl,
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  } catch (error) {
    throw new Error('Payment processing failed. Please check your payment method and try again.');
  }
};

export const confirmPayment = async (clientSecret: string): Promise<boolean> => {
  // Mock payment confirmation
  return true;
};

// Razorpay integration functions
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createRazorpayOrder(amount: number, currency = 'INR', receipt?: string): Promise<RazorpayOrder> {
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency || 'INR',
      receipt: order.receipt || '',
      status: order.status,
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret not configured');
  }

  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}

export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

// Payment validation utilities
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');

  // Check length (13-19 digits for most cards)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  // Luhn algorithm validation
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }

  return true;
};

export const validateCVV = (cvv: string): boolean => {
  const cleaned = cvv.replace(/\D/g, '');
  return cleaned.length >= 3 && cleaned.length <= 4 && /^\d+$/.test(cleaned);
};

export const validateUPIId = (upiId: string): boolean => {
  // Basic UPI ID validation: should contain @ and be in valid format
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiRegex.test(upiId) && upiId.length >= 3 && upiId.length <= 50;
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return cleaned;

  const last4 = cleaned.slice(-4);
  const masked = '•'.repeat(cleaned.length - 4) + last4;

  // Format with spaces for better readability
  return masked.replace(/(.{4})/g, '$1 ').trim();
};

export const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');

  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  if (/^35/.test(cleaned)) return 'jcb';
  if (/^30[0-5]/.test(cleaned)) return 'diners';

  return 'unknown';
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/(\d{1,4})/g);
  return match ? match.join(' ') : '';
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }
  return cleaned;
};

// Additional utility functions for enhanced payment processing
export const isValidPaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
};

export const sanitizeCardInput = (input: string): string => {
  return input.replace(/[^\d\s]/g, '').slice(0, 23); // Max 19 digits + 4 spaces
};

export const sanitizeExpiryInput = (input: string): string => {
  return input.replace(/[^\d]/g, '').slice(0, 4);
};

export const sanitizeCVVInput = (input: string): string => {
  return input.replace(/[^\d]/g, '').slice(0, 4);
};
