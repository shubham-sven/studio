
import { Gavel } from 'lucide-react';
import { artworks } from '@/lib/data';
import { ArtworkCard } from '@/components/artwork-card';

export default function AuctionsPage() {
  const auctionArtworks = artworks.filter(art => art.biddingEnabled);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Gavel className="h-10 w-10 text-primary" />
        <h1 className="font-headline text-5xl font-bold">Live Auctions</h1>
      </div>

      {auctionArtworks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {auctionArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed">
            <Gavel className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No Live Auctions</h3>
            <p className="mt-2 text-base text-muted-foreground">
                There are no artworks currently up for auction. Check back later!
            </p>
        </div>
      )}
    </div>
  );
}
