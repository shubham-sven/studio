import Link from 'next/link';
import { artists, findImageById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <h1 className="font-headline text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Our Artists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover talented artists from around the world, each bringing their unique perspective and creativity to the art world.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => {
            const avatarImage = findImageById(artist.avatarId);
            return (
              <Link key={artist.id} href={`/artists/${artist.id}`}>
                <Card className="hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4 border-4 border-purple-300 dark:border-purple-600 shadow-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                        {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={artist.name} />}
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-headline text-xl font-semibold mb-2 text-purple-800 dark:text-purple-200">{artist.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {artist.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
