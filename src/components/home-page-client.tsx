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
import { Slider } from './ui/slider';

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

const MAX_PRICE = 1500;

export default function HomePageClient({
  initialArtworks,
}: HomePageClientProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const categoryMatch = categoryFilter === 'All' || art.category === categoryFilter;
      const priceMatch = art.price >= priceRange[0] && art.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [artworks, categoryFilter, priceRange]);

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <Recommendations />
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <h2 className="font-headline text-4xl font-semibold">Explore Art</h2>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
                <span className='text-sm text-muted-foreground whitespace-nowrap'>Filter by category:</span>
                <Select onValueChange={setCategoryFilter} defaultValue="All">
                  <SelectTrigger className="w-full md:w-[180px]">
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
             <div className="flex items-center gap-3 w-full md:w-[300px]">
                <span className='text-sm text-muted-foreground whitespace-nowrap'>Price Range:</span>
                <Slider
                    defaultValue={[MAX_PRICE]}
                    max={MAX_PRICE}
                    step={50}
                    onValueChange={(value) => setPriceRange([0, value[0]])}
                    className="w-full"
                />
                <span className="text-sm font-medium w-24 text-right">${priceRange[1]}</span>
            </div>
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
