'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { findImageById } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/payments';
import { format } from 'date-fns';
import Link from 'next/link';
import { Package, Clock, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

const PREFERENCES_KEY = 'artify-user-preferences';

export default function AccountPage() {
  const { user } = useAuth();
  const userImage = findImageById(user.avatarId);
  const { toast } = useToast();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user.role !== 'guest') {
      fetchRecentOrders();
    }
  }, [user]);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user.id}&limit=3`);
      const data = await response.json();

      if (data.success) {
        setRecentOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const preferences = formData.get('preferences') as string;
    localStorage.setItem(PREFERENCES_KEY, preferences);
    toast({
      title: 'Preferences Saved',
      description: 'Your AI recommendations will now be updated.',
    });
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
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 flex items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary">
          {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} />}
          <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-headline text-4xl font-bold">{user.name}</h1>
          <p className="text-lg text-muted-foreground capitalize">{user.role}</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                     <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Recent Orders Section */}
            {user.role !== 'guest' && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Track your latest purchases</CardDescription>
                    </div>
                    <Link href="/account/orders">
                      <Button variant="outline" size="sm">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="text-center py-4">Loading orders...</div>
                  ) : recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Link href="/">
                        <Button className="mt-4">Browse Artworks</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.orderDate), 'PPP')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            <p className="text-sm font-medium mt-1">{formatPrice(order.total)}</p>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="ghost" size="sm" className="mt-2">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>

        <div>
            <Card>
                 <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Art Preferences</CardTitle>
                        <CardDescription>Help our AI recommend art you'll love. Describe your taste.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="preferences">Your Preferences</Label>
                            <Textarea
                                id="preferences"
                                name="preferences"
                                placeholder="e.g., I love colorful abstract art, surreal landscapes, and modern digital art."
                                rows={5}
                                defaultValue={typeof window !== 'undefined' ? localStorage.getItem(PREFERENCES_KEY) ?? '' : ''}
                            />
                        </div>
                         <Button type="submit" className="w-full">Save Preferences</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
