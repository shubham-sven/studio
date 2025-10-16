'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const artist = getArtistById(artwork.artistId);
  const image = findImageById(artwork.imageId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(artwork.id);

  if (!artist || !image) {
    return null;
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(artwork);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/art/${artwork.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={image.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
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
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-xl leading-tight truncate">
            {artwork.title}
          </CardTitle>
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
        <CardFooter className="flex justify-between items-center p-4 pt-0">
          <Badge variant="outline">{artwork.category}</Badge>
          <p className="text-lg font-semibold text-primary">
            ${artwork.price.toFixed(2)}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
