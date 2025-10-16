'use client';

import { useState, useMemo } from 'react';
import type { Artwork } from '@/lib/data';
import { ArtworkCard } from './artwork-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Recommendations } from './recommendations';

interface HomePageClientProps {
  initialArtworks: Artwork[];
}

const categories = [
  'All',
  'Abstract',
  'Portrait',
  'Landscape',
  'Digital',
  'Surrealism',
];

export default function HomePageClient({
  initialArtworks,
}: HomePageClientProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredArtworks = useMemo(() => {
    if (categoryFilter === 'All') {
      return artworks;
    }
    return artworks.filter((art) => art.category === categoryFilter);
  }, [artworks, categoryFilter]);

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <Recommendations />
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-headline text-4xl font-semibold">Explore Art</h2>
          <div className="flex items-center gap-4">
            <span className='text-sm text-muted-foreground'>Filter by category:</span>
            <Select onValueChange={setCategoryFilter} defaultValue="All">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
    </>
  );
}
