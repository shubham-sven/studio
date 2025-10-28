'use client';

import { Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { artworks, artists } from '@/lib/data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

interface ArtRecommendation {
  artworkId: string;
  title: string;
  artist: string;
  category: string;
  description: string;
}

const BROWSING_HISTORY_KEY = 'artify-browsing-history';
const PREFERENCES_KEY = 'artify-user-preferences';

function RecommendationCard({ artwork }: { artwork: ArtRecommendation }) {
  const placeholderImage = `https://picsum.photos/seed/${artwork.artworkId}/600/800`

  return (
    <Card className="overflow-hidden group">
      <Link href={`/art/${artwork.artworkId}`}>
         <CardHeader className="p-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={placeholderImage}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="recommended art"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm font-semibold truncate">{artwork.title}</p>
          <p className="text-xs text-muted-foreground">by {artwork.artist}</p>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{artwork.description}</p>
        </CardContent>
      </Link>
    </Card>
  )
}


export function Recommendations() {
  const [recommendations, setRecommendations] = useState<ArtRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const storedHistory = localStorage.getItem(BROWSING_HISTORY_KEY);
      const browsingHistory = storedHistory ? JSON.parse(storedHistory) : [];

      if (browsingHistory.length === 0) {
        setError("Browse some art first to get personalized recommendations!");
        setLoading(false);
        return;
      }

      // Simple recommendation logic based on browsing history
      const viewedCategories = browsingHistory.map((item: any) => item.category);
      const mostViewedCategory = viewedCategories.reduce((a: string, b: string, i: number, arr: string[]) =>
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, viewedCategories[0]
      );

      // Get artworks from the same category, excluding viewed ones
      const viewedIds = browsingHistory.map((item: any) => item.artworkId);
      const recommendedArtworks = artworks
        .filter(art => art.category === mostViewedCategory && !viewedIds.includes(art.id))
        .slice(0, 5)
        .map(art => {
          const artist = artists.find(a => a.id === art.artistId);
          return {
            artworkId: art.id,
            title: art.title,
            artist: artist?.name || 'Unknown Artist',
            category: art.category,
            description: art.description
          };
        });

      setRecommendations(recommendedArtworks);
    } catch (err) {
      console.error(err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-2xl">For You</CardTitle>
        <CardDescription>Personalized recommendations based on your activity.</CardDescription>
            </div>
        </div>
        <Button onClick={getRecommendations} disabled={loading} className="bg-accent hover:bg-accent/90">
            {loading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
               <div key={i} className="space-y-2">
                 <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
               </div>
            ))}
          </div>
        )}
        {error && <p className="text-destructive text-center">{error}</p>}
        {!loading && recommendations && (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {recommendations.slice(0,5).map((rec) => <RecommendationCard key={rec.artworkId} artwork={rec} />)}
           </div>
        )}
         {!loading && !recommendations && !error && (
            <p className="text-center text-muted-foreground py-8">Click the button to generate your personalized art feed!</p>
        )}
      </CardContent>
    </Card>
  );
}
