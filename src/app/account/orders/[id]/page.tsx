'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  Phone,
  Mail
} from 'lucide-react';
import { formatPrice } from '@/lib/payments';
import { format } from 'date-fns';
import Link from 'next/link';
import { getArtworkById, getArtistById } from '@/lib/data';
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
  cancellationReason: string | null;
  cancellationComments: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderStatus {
  order: {
    id: string;
    status: string;
    paymentStatus: string;
    trackingNumber: string;
    estimatedDelivery: string;
    actualDelivery: string | null;
    orderDate: string;
  };
  statusProgress: {
    [key: string]: {
      step: number;
      label: string;
      completed: boolean;
    };
  };
  currentStep: number;
}

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (user.role === 'guest') {
      router.push('/login');
      return;
    }

    fetchOrderDetails();
    fetchOrderStatus();
  }, [user, router, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}&userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setOrderStatus(data);
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCancelled = () => {
    fetchOrderDetails();
    fetchOrderStatus();
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
        return <Clock className="h-5 w-5" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'packed':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <Clock className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (!order || !orderStatus) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/account/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = order.status === 'cancelled' ? 0 : (orderStatus.currentStep / 5) * 100;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/account/orders">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
        <p className="text-muted-foreground">
          Placed on {format(new Date(order.orderDate), 'PPP')}
        </p>
      </div>

      {/* Order Status Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>
              <span className="text-sm text-muted-foreground">
                {order.status === 'cancelled' ? 'Cancelled' : `${progressPercentage.toFixed(0)}% Complete`}
              </span>
            </div>
            {order.status !== 'cancelled' && (
              <Progress value={progressPercentage} className="w-full" />
            )}

            {/* Cancellation Info */}
            {order.status === 'cancelled' && order.cancellationReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Order Cancelled</h4>
                <p className="text-sm text-red-700 mb-1">
                  <strong>Reason:</strong> {order.cancellationReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                {order.cancellationComments && (
                  <p className="text-sm text-red-700">
                    <strong>Comments:</strong> {order.cancellationComments}
                  </p>
                )}
              </div>
            )}

            {/* Tracking Timeline */}
            {order.status !== 'cancelled' && (
              <div className="space-y-4">
                {Object.entries(orderStatus.statusProgress).map(([key, status], index) => {
                  const isCompleted = status.completed;
                  const isCurrent = order.status === key;
                  const isLast = index === Object.keys(orderStatus.statusProgress).length - 1;

                  return (
                    <div key={key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-primary text-primary-foreground' :
                          isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {getStatusIcon(key)}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 mt-2 ${
                            isCompleted ? 'bg-primary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${isCompleted ? 'text-foreground' : isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                            {status.label}
                          </h4>
                          {isCompleted && (
                            <span className="text-xs text-muted-foreground">
                              {key === 'delivered' && order.actualDelivery ?
                                format(new Date(order.actualDelivery), 'MMM dd, yyyy') :
                                key === 'shipped' && order.trackingNumber ?
                                `Tracking: ${order.trackingNumber}` :
                                format(new Date(order.orderDate), 'MMM dd, yyyy')
                              }
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {key === 'placed' && 'Your order has been placed successfully'}
                          {key === 'confirmed' && 'Your order has been confirmed and is being processed'}
                          {key === 'packed' && 'Your order has been packed and is ready for shipping'}
                          {key === 'shipped' && `Your order is out for delivery${order.trackingNumber ? ` (Tracking: ${order.trackingNumber})` : ''}`}
                          {key === 'delivered' && 'Your order has been delivered successfully'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Delivery Information */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Delivery Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Estimated Delivery: {format(new Date(order.estimatedDelivery), 'PPP')}</p>
                  {order.trackingNumber && (
                    <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const artwork = getArtworkById(item.artworkId);
                  const artist = artwork ? getArtistById(artwork.artistId) : null;

                  return (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        {artist && (
                          <p className="text-sm text-muted-foreground">by {artist.name}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Details
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Method: <span className="capitalize">{order.paymentMethod}</span></p>
                  <p>Status: <span className="capitalize">{order.paymentStatus}</span></p>
                  {order.trackingNumber && (
                    <p>Tracking: {order.trackingNumber}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </h4>
                <div className="text-sm text-muted-foreground">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                  <p className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Delivery Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Estimated: {format(new Date(order.estimatedDelivery), 'PPP')}</p>
                  {order.actualDelivery && (
                    <p>Delivered: {format(new Date(order.actualDelivery), 'PPP')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            {order.status === 'delivered' && (
              <Button className="w-full" variant="outline">
                Write a Review
              </Button>
            )}
            {['placed', 'confirmed'].includes(order.status) && (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </Button>
            )}
            <Button className="w-full" variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        orderId={order.id}
        orderStatus={order.status}
        onOrderCancelled={handleOrderCancelled}
      />
    </div>
  );
}
