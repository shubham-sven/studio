'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { artworks, findImageById, getArtistById } from '@/lib/data';

const FEATURED_ARTWORKS = artworks.slice(0, 6); // First 6 artworks as featured

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_ARTWORKS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_ARTWORKS.length) % FEATURED_ARTWORKS.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentArtwork = FEATURED_ARTWORKS[currentIndex];
  const artist = getArtistById(currentArtwork.artistId);
  const image = findImageById(currentArtwork.imageId);

  if (!artist || !image) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <h2 className="text-3xl font-bold mb-4">Featured Artwork</h2>
          <h3 className="text-2xl font-semibold mb-2">{currentArtwork.title}</h3>
          <p className="text-lg mb-2">by {artist.name}</p>
          <p className="text-sm opacity-90 mb-6 line-clamp-3">{currentArtwork.description}</p>
          <Link href={`/art/${currentArtwork.id}`}>
            <Button variant="secondary" size="lg">
              View Artwork
            </Button>
          </Link>
        </div>
        <div className="flex-1 relative h-80">
          <Image
            src={image.imageUrl}
            alt={currentArtwork.title}
            fill
            className="object-cover rounded-lg shadow-2xl"
            data-ai-hint={image.imageHint}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {FEATURED_ARTWORKS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </section>
  );
}
