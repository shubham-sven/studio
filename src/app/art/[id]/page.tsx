import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArtworkById, getArtistById, findImageById, artworks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { ArtworkViewTracker } from '@/components/artwork-view-tracker';
import BiddingPanel from '@/components/bidding-panel';

export async function generateStaticParams() {
  return artworks.map((artwork) => ({
    id: artwork.id,
  }));
}

interface ArtworkPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = await params;
  const artwork = getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  const artist = getArtistById(artwork.artistId);
  const image = findImageById(artwork.imageId);

  if (!artist || !image) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <ArtworkViewTracker artwork={artwork} />
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-lg overflow-hidden border shadow-lg bg-white/50 dark:bg-gray-800/50">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={image.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <Badge variant="secondary" className="w-fit bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200">
                {artwork.category}
              </Badge>
              <h1 className="font-headline text-4xl lg:text-5xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {artwork.title}
              </h1>
              <p className="text-lg mt-2 text-muted-foreground">
                by{' '}
                <Link
                  href={`/artists/${artist.id}`}
                  className="font-semibold hover:underline text-purple-600 dark:text-purple-400"
                >
                  {artist.name}
                </Link>
              </p>
              <Separator className="my-6 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800" />
              <p className="text-base leading-relaxed">{artwork.description}</p>
              <div className="mt-auto pt-8">
                {artwork.biddingEnabled ? (
                    <BiddingPanel artwork={artwork} />
                ) : (
                    <div className="flex justify-between items-center rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border border-purple-200 dark:border-purple-800 p-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                ${artwork.price.toFixed(2)}
                            </p>
                        </div>
                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Buy Now
                        </Button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
