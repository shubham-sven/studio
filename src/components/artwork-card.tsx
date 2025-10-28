'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Gavel, ShoppingCart, Plus } from 'lucide-react';
import type { Artwork, Artist } from '@/lib/data';
import { findImageById, getArtistById } from '@/lib/data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { Badge } from './ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { createCheckoutSession, formatPrice } from '@/lib/payments';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const artist = getArtistById(artwork.artistId);
  const image = findImageById(artwork.imageId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(artwork.id);
  const [timeLeft, setTimeLeft] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!artwork.auctionEndDate) return;

    const interval = setInterval(() => {
      const endDate = parseISO(artwork.auctionEndDate!);
      if (new Date() > endDate) {
        setTimeLeft('Auction Ended');
        clearInterval(interval);
      } else {
        setTimeLeft(formatDistanceToNow(endDate, { addSuffix: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [artwork.auctionEndDate]);

  if (!artist || !image) {
    return null;
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(artwork);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (user.role === 'guest') {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to add items to your cart.',
      });
      return;
    }

    try {
      await addToCart(artwork.id);
      toast({
        title: 'Added to Cart',
        description: `"${artwork.title}" has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
      });
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (user.role === 'guest') {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to purchase artworks.',
      });
      return;
    }

    setIsPurchasing(true);
    try {
      const session = await createCheckoutSession(
        [{ artworkId: artwork.id, price: artwork.price, title: artwork.title }],
        `${window.location.origin}/checkout/success`,
        `${window.location.origin}/art/${artwork.id}`
      );

      // In production, redirect to Stripe Checkout
      // window.location.href = session.url;

      // For mock, show success message
      toast({
        title: 'Purchase Successful!',
        description: `You have purchased "${artwork.title}" for ${formatPrice(artwork.price)}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase. Please try again.',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/art/${artwork.id}`} className="block">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={image.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
            {artwork.biddingEnabled && (
                <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-sm p-2 text-white text-center text-xs">
                    Auction ends {timeLeft}
                </div>
            )}
          </div>
        </Link>
         <Button
              size="icon"
              variant="secondary"
              className={cn(
                'absolute top-3 right-3 rounded-full h-9 w-9 bg-background/70 backdrop-blur-sm transition-all hover:bg-background/90',
                favorite && 'text-red-500 hover:text-red-600'
              )}
              onClick={handleFavoriteClick}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn(favorite && 'fill-current')} />
         </Button>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/art/${artwork.id}`}>
          <CardTitle className="font-headline text-xl leading-tight truncate hover:text-primary">
            {artwork.title}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          by{' '}
          <Link
            href={`/artists/${artist.id}`}
            className="hover:text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {artist.name}
          </Link>
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex justify-between items-center w-full">
          <Badge variant="outline">{artwork.category}</Badge>
          {artwork.biddingEnabled ? (
            <Link href={`/art/${artwork.id}`} className="text-right">
              <p className="text-xs text-muted-foreground">Current Bid</p>
              <p className="text-lg font-semibold text-primary">
                ${(artwork.currentBid ?? artwork.startPrice)?.toFixed(2)}
              </p>
            </Link>
          ) : (
            <Link href={`/art/${artwork.id}`}>
              <p className="text-lg font-semibold text-primary">
                {formatPrice(artwork.price)}
              </p>
            </Link>
          )}
        </div>
        {!artwork.biddingEnabled && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={isPurchasing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isPurchasing ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
