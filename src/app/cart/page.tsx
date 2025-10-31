'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { findImageById, getArtworkById } from '@/lib/data';
import { formatPrice } from '@/lib/payments';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some beautiful artworks to your cart and they will appear here.
            </p>
            <Link href="/">
              <Button size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update quantity. Please try again.',
      });
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
      });
    }
  };

  const handleCheckout = async () => {
    if (user.role === 'guest') {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to checkout.',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const lineItems = cart.items.map(item => {
        const artwork = getArtworkById(item.artworkId);
        if (!artwork) throw new Error(`Artwork ${item.artworkId} not found`);
        return {
          artworkId: artwork.id,
          price: artwork.price,
          title: artwork.title,
          quantity: item.quantity,
        };
      });

      // Redirect to checkout page instead of direct payment
      router.push('/checkout');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description: 'There was an error processing your checkout. Please try again.',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const artwork = getArtworkById(item.artworkId);
                if (!artwork) return null;

                const image = findImageById(artwork.imageId);
                if (!image) return null;

                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Link href={`/art/${artwork.id}`} className="flex-shrink-0">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={image.imageUrl}
                              alt={artwork.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link href={`/art/${artwork.id}`}>
                            <h3 className="font-semibold text-lg truncate hover:text-primary">
                              {artwork.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-sm mt-1">
                            by {artwork.artistId}
                          </p>
                          <p className="text-lg font-semibold text-primary mt-2">
                            {formatPrice(artwork.price)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-lg font-semibold">
                            {formatPrice(artwork.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items ({getCartItemCount()})</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
