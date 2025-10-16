'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { ArtworkCard } from '@/components/artwork-card';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Heart className="h-10 w-10 text-primary" />
        <h1 className="font-headline text-5xl font-bold">Your Favorites</h1>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No Favorites Yet</h3>
            <p className="mt-2 text-base text-muted-foreground">
                Click the heart icon on any artwork to save it here.
            </p>
        </div>
      )}
    </div>
  );
}
