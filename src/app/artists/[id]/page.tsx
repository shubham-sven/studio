import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArtistById, getArtworksByArtist, findImageById, artists } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArtworkCard } from '@/components/artwork-card';
import { ContactArtistModal } from '@/components/contact-artist-modal';

export async function generateStaticParams() {
  return artists.map((artist) => ({
    id: artist.id,
  }));
}

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;
  const artist = getArtistById(id);
  if (!artist) {
    notFound();
  }

  const artworks = getArtworksByArtist(artist.id);
  const avatarImage = findImageById(artist.avatarId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-12">
        <header className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <Avatar className="h-32 w-32 border-4 border-purple-300 dark:border-purple-600 shadow-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={artist.name} />}
            <AvatarFallback className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">{artist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-headline text-5xl font-bold text-center md:text-left bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{artist.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-center md:text-left">{artist.bio}</p>
            <div className="mt-6 flex justify-center md:justify-start">
              <ContactArtistModal artistName={artist.name} artistId={artist.id} />
            </div>
          </div>
        </header>

        <main className="bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <h2 className="font-headline text-4xl font-semibold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Artworks</h2>
          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-6">This artist has not uploaded any artwork yet.</p>
          )}
        </main>
      </div>
    </div>
  );
}
