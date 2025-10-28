import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById } from '@/lib/data';

// Mock database - in production, replace with real database
let orders: any[] = [];

// GET /api/orders - Get orders for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    if (orderId) {
      // Get specific order
      const order = orders.find(o => o.id === orderId && o.userId === userId);
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        order,
      });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userOrders = orders.filter(order => order.userId === userId);

    return NextResponse.json({
      success: true,
      orders: userOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency = 'INR',
      paymentMethod,
      shippingAddress,
      billingAddress,
    } = body;

    // Validation
    if (!userId || !items || !subtotal || !total || !paymentMethod || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate items and calculate totals
    const orderItems = items.map((item: any) => {
      const artwork = getArtworkById(item.artworkId);
      if (!artwork) {
        throw new Error(`Artwork ${item.artworkId} not found`);
      }
      return {
        id: `order-item-${Date.now()}-${Math.random()}`,
        artworkId: item.artworkId,
        quantity: item.quantity,
        price: artwork.price,
        title: artwork.title,
        artistId: artwork.artistId,
      };
    });

    const orderId = `ORD-${Date.now()}`;

    const newOrder = {
      id: orderId,
      userId,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency,
      status: 'placed',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      actualDelivery: null,
      trackingNumber: `TN${Date.now()}`,
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update order (for status updates)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      userId,
      status,
      paymentStatus,
      trackingNumber,
      notes,
    } = body;

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: 'Order ID and User ID are required' },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex(order => order.id === orderId && order.userId === userId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updatedOrder = {
      ...orders[orderIndex],
      status: status || orders[orderIndex].status,
      paymentStatus: paymentStatus || orders[orderIndex].paymentStatus,
      trackingNumber: trackingNumber || orders[orderIndex].trackingNumber,
      notes: notes !== undefined ? notes : orders[orderIndex].notes,
      updatedAt: new Date().toISOString(),
    };

    // If order is delivered, set actual delivery date
    if (status === 'delivered' && !orders[orderIndex].actualDelivery) {
      updatedOrder.actualDelivery = new Date().toISOString();
    }

    orders[orderIndex] = updatedOrder;

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
