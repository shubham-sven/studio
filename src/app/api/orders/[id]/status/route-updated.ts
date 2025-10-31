import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, replace with real database
// This would typically be shared with the main orders route
let orders: any[] = [
  {
    id: 'ORD-1234567890',
    userId: 'user-123',
    status: 'placed',
    paymentStatus: 'paid',
    trackingNumber: 'TN1234567890',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1234567891',
    userId: 'user-123',
    status: 'confirmed',
    paymentStatus: 'paid',
    trackingNumber: 'TN1234567891',
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1234567892',
    userId: 'user-123',
    status: 'packed',
    paymentStatus: 'paid',
    trackingNumber: 'TN1234567892',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1234567893',
    userId: 'user-123',
    status: 'shipped',
    paymentStatus: 'paid',
    trackingNumber: 'TN1234567893',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1234567894',
    userId: 'user-123',
    status: 'delivered',
    paymentStatus: 'paid',
    trackingNumber: 'TN1234567894',
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1234567895',
    userId: 'user-123',
    status: 'cancelled',
    paymentStatus: 'refunded',
    trackingNumber: null,
    estimatedDelivery: null,
    actualDelivery: null,
    cancellationReason: 'changed_mind',
    cancellationComments: 'Found a better deal elsewhere',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// GET /api/orders/[id]/status - Get order status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const order = orders.find(o => o.id === orderId && o.userId === userId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Calculate status progress
    const statusProgress = {
      placed: { step: 1, label: 'Order Placed', completed: true },
      confirmed: { step: 2, label: 'Order Confirmed', completed: order.status !== 'placed' },
      packed: { step: 3, label: 'Order Packed', completed: ['packed', 'shipped', 'delivered'].includes(order.status) },
      shipped: { step: 4, label: 'Out for Delivery', completed: ['shipped', 'delivered'].includes(order.status) },
      delivered: { step: 5, label: 'Delivered', completed: order.status === 'delivered' },
      cancelled: { step: 0, label: 'Order Cancelled', completed: order.status === 'cancelled' },
    };

    const currentStep = (statusProgress as any)[order.status]?.step || 1;

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        actualDelivery: order.actualDelivery,
        orderDate: order.createdAt,
        cancellationReason: order.cancellationReason,
        cancellationComments: order.cancellationComments,
      },
      statusProgress,
      currentStep,
    });
  } catch (error) {
    console.error('Error fetching order status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order status' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]/status - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const { userId, status, trackingNumber, cancellationReason, cancellationComments } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex(o => o.id === orderId && o.userId === userId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const currentOrder = orders[orderIndex];

    // Check if cancellation is allowed
    if (status === 'cancelled' && !['placed', 'confirmed'].includes(currentOrder.status)) {
      return NextResponse.json(
        { error: 'Order cannot be cancelled at this stage' },
        { status: 400 }
      );
    }

    const updatedOrder = {
      ...currentOrder,
      status: status || currentOrder.status,
      trackingNumber: trackingNumber || currentOrder.trackingNumber,
      cancellationReason: cancellationReason || currentOrder.cancellationReason,
      cancellationComments: cancellationComments || currentOrder.cancellationComments,
      updatedAt: new Date().toISOString(),
    };

    // If order is delivered, set actual delivery date
    if (status === 'delivered' && !currentOrder.actualDelivery) {
      updatedOrder.actualDelivery = new Date().toISOString();
    }

    // If order is cancelled, update payment status to refunded
    if (status === 'cancelled') {
      updatedOrder.paymentStatus = 'refunded';
      updatedOrder.trackingNumber = null;
      updatedOrder.estimatedDelivery = null;
    }

    orders[orderIndex] = updatedOrder;

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
