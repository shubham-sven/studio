'use client';

import { Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { recommendArt, type ArtRecommendationsOutput } from '@/ai/flows/art-recommendations';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

const BROWSING_HISTORY_KEY = 'artify-browsing-history';
const PREFERENCES_KEY = 'artify-user-preferences';

function RecommendationCard({ artwork }: { artwork: ArtRecommendationsOutput[0] }) {
  // We can't know the artwork ID for a real lookup, so we'll use a placeholder.
  // In a real app, the AI would return valid artwork IDs.
  const placeholderImage = `https://picsum.photos/seed/${artwork.artworkId}/600/800`

  return (
    <Card className="overflow-hidden group">
      <Link href="#">
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
  const [recommendations, setRecommendations] = useState<ArtRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const storedHistory = localStorage.getItem(BROWSING_HISTORY_KEY);
      const browsingHistory = storedHistory ? JSON.parse(storedHistory) : [];
      
      const preferences = localStorage.getItem(PREFERENCES_KEY) || "I like modern and vibrant art.";

      if (browsingHistory.length === 0) {
        setError("Browse some art first to get personalized recommendations!");
        setLoading(false);
        return;
      }

      const result = await recommendArt({ browsingHistory, preferences });
      setRecommendations(result);
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
                <CardDescription>AI-powered recommendations based on your activity.</CardDescription>
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
