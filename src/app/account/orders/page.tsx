'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/payments';
import { format } from 'date-fns';
import Link from 'next/link';
import CancelOrderModal from '@/components/cancel-order-modal';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    artworkId: string;
    quantity: number;
    price: number;
    title: string;
    artistId: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: any;
  billingAddress: any;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  trackingNumber: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user.role === 'guest') {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleOrderCancelled = () => {
    fetchOrders(); // Refresh orders after cancellation
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'packed':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'packed':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your art purchases</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet. Start exploring our collection!
            </p>
            <Link href="/">
              <Button>Browse Artworks</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(new Date(order.orderDate), 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                        <p>{order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Details
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Method: <span className="capitalize">{order.paymentMethod}</span></p>
                        <p>Status: <span className="capitalize">{order.paymentStatus}</span></p>
                        {order.trackingNumber && (
                          <p>Tracking: {order.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Information</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Estimated Delivery: {format(new Date(order.estimatedDelivery), 'PPP')}</p>
                      {order.actualDelivery && (
                        <p>Delivered on: {format(new Date(order.actualDelivery), 'PPP')}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Write Review
                      </Button>
                    )}
                    {['placed', 'confirmed'].includes(order.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <CancelOrderModal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setSelectedOrder(null);
          }}
          orderId={selectedOrder.id}
          orderStatus={selectedOrder.status}
          onOrderCancelled={handleOrderCancelled}
        />
      )}
    </div>
  );
}
