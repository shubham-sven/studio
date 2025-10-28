import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, replace with real database
let paymentMethods: any[] = [
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
];

// GET /api/payment-methods - Get all payment methods for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === userId);

    return NextResponse.json({
      success: true,
      paymentMethods: userPaymentMethods,
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST /api/payment-methods - Create a new payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      provider,
      last4,
      maskedNumber,
      expiryMonth,
      expiryYear,
      upiId,
      bankCode,
      walletId,
      nickname,
      isDefault = false,
      token,
    } = body;

    // Validation
    if (!userId || !type) {
      return NextResponse.json(
        { error: 'User ID and type are required' },
        { status: 400 }
      );
    }

    // Type-specific validation
    if (type === 'card' && (!last4 || !maskedNumber || !expiryMonth || !expiryYear)) {
      return NextResponse.json(
        { error: 'Card details are required' },
        { status: 400 }
      );
    }

    if (type === 'upi' && !upiId) {
      return NextResponse.json(
        { error: 'UPI ID is required' },
        { status: 400 }
      );
    }

    if (type === 'netbanking' && !bankCode) {
      return NextResponse.json(
        { error: 'Bank code is required' },
        { status: 400 }
      );
    }

    if (type === 'wallet' && !walletId) {
      return NextResponse.json(
        { error: 'Wallet ID is required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults for this user
    if (isDefault) {
      paymentMethods = paymentMethods.map(pm =>
        pm.userId === userId ? { ...pm, isDefault: false } : pm
      );
    }

    const newPaymentMethod = {
      id: `pm-${Date.now()}`,
      userId,
      type,
      provider,
      last4,
      maskedNumber,
      expiryMonth,
      expiryYear,
      upiId,
      bankCode,
      walletId,
      nickname,
      isDefault,
      isVerified: true, // Assume verified for demo
      emiEligible: type === 'card', // Assume eligible for demo
      token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    paymentMethods.push(newPaymentMethod);

    return NextResponse.json({
      success: true,
      paymentMethod: newPaymentMethod,
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    );
  }
}

// PUT /api/payment-methods - Update a payment method
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      userId,
      nickname,
      isDefault,
    } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Payment method ID and User ID are required' },
        { status: 400 }
      );
    }

    const pmIndex = paymentMethods.findIndex(pm => pm.id === id && pm.userId === userId);

    if (pmIndex === -1) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults for this user
    if (isDefault) {
      paymentMethods = paymentMethods.map(pm =>
        pm.userId === userId ? { ...pm, isDefault: false } : pm
      );
    }

    paymentMethods[pmIndex] = {
      ...paymentMethods[pmIndex],
      nickname,
      isDefault,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      paymentMethod: paymentMethods[pmIndex],
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

// DELETE /api/payment-methods - Delete a payment method
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Payment method ID and User ID are required' },
        { status: 400 }
      );
    }

    const pmIndex = paymentMethods.findIndex(pm => pm.id === id && pm.userId === userId);

    if (pmIndex === -1) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    const deletedPaymentMethod = paymentMethods.splice(pmIndex, 1)[0];

    return NextResponse.json({
      success: true,
      paymentMethod: deletedPaymentMethod,
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}
