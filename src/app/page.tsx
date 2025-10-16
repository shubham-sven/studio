import { artworks } from '@/lib/data';
import HomePageClient from '@/components/home-page-client';

export default function Home() {
  return (
    <div>
      <section className="bg-card py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-5xl font-bold text-primary md:text-7xl">
            Artify
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Discover Your Next Masterpiece.
          </p>
        </div>
      </section>

      <HomePageClient initialArtworks={artworks} />
    </div>
  );
}
