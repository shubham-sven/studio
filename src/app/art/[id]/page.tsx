import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArtworkById, getArtistById, findImageById, Artwork } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { ArtworkViewTracker } from '@/components/artwork-view-tracker';

interface ArtworkPageProps {
  params: { id: string };
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
  const artwork = getArtworkById(params.id);

  if (!artwork) {
    notFound();
  }

  const artist = getArtistById(artwork.artistId);
  const image = findImageById(artwork.imageId);

  if (!artist || !image) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <ArtworkViewTracker artwork={artwork} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="rounded-lg overflow-hidden border shadow-lg">
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
          <Badge variant="secondary" className="w-fit">
            {artwork.category}
          </Badge>
          <h1 className="font-headline text-4xl lg:text-5xl font-bold mt-2 text-primary">
            {artwork.title}
          </h1>
          <p className="text-lg mt-2 text-muted-foreground">
            by{' '}
            <Link
              href={`/artists/${artist.id}`}
              className="font-semibold hover:underline"
            >
              {artist.name}
            </Link>
          </p>
          <Separator className="my-6" />
          <p className="text-base leading-relaxed">{artwork.description}</p>
          <div className="mt-auto pt-8">
            <div className="flex justify-between items-center rounded-lg bg-card border p-4">
                <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-3xl font-bold text-accent">
                        ${artwork.price.toFixed(2)}
                    </p>
                </div>
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
