import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArtistById, getArtworksByArtist, findImageById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArtworkCard } from '@/components/artwork-card';

interface ArtistPageProps {
  params: { id: string };
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = getArtistById(params.id);
  if (!artist) {
    notFound();
  }

  const artworks = getArtworksByArtist(artist.id);
  const avatarImage = findImageById(artist.avatarId);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
          {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={artist.name} />}
          <AvatarFallback className="text-4xl">{artist.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-headline text-5xl font-bold text-center md:text-left">{artist.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-center md:text-left">{artist.bio}</p>
        </div>
      </header>

      <main>
        <h2 className="font-headline text-4xl font-semibold mb-8">Artworks</h2>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">This artist has not uploaded any artwork yet.</p>
        )}
      </main>
    </div>
  );
}
