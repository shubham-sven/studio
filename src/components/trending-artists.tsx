'use client';

import Image from 'next/image';
import Link from 'next/link';
import { artists, findImageById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const TRENDING_ARTISTS = artists.slice(0, 8); // First 8 artists as trending

export function TrendingArtists() {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Trending Artists
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TRENDING_ARTISTS.map((artist) => {
          const avatarImage = findImageById(artist.avatarId);
          return (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              className="group text-center"
            >
              <div className="relative mb-3">
                <Avatar className="w-20 h-20 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {avatarImage && (
                    <AvatarImage src={avatarImage.imageUrl} alt={artist.name} />
                  )}
                  <AvatarFallback className="text-lg font-semibold">
                    {artist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  🔥
                </div>
              </div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {artist.bio}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
