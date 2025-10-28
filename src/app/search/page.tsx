'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { artworks, artists } from '@/lib/data';
import { ArtworkCard } from '@/components/artwork-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Save, Clock, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const categories = [
  'All',
  'Abstract',
  'Portrait',
  'Landscape',
  'Digital',
  'Surrealism',
];

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'popularity', label: 'Popularity' },
];

const MAX_PRICE = 1500;

export default function SearchPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [sortBy, setSortBy] = useState('relevance');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);

  // Autocomplete suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = [
        ...new Set([
          ...artworks.map(a => a.title).filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())),
          ...artists.map(a => a.name).filter(n => n.toLowerCase().includes(searchQuery.toLowerCase())),
        ])
      ].slice(0, 5);
      setAutocompleteSuggestions(suggestions);
    } else {
      setAutocompleteSuggestions([]);
    }
  }, [searchQuery]);

  // Load saved searches
  useEffect(() => {
    if (user.role !== 'guest') {
      const saved = localStorage.getItem(`saved-searches-${user.id}`);
      if (saved) setSavedSearches(JSON.parse(saved));
    }
  }, [user]);

  const saveSearch = () => {
    if (user.role === 'guest') {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please log in to save searches.' });
      return;
    }
    const newSaved = [...savedSearches, searchQuery].slice(-5); // Keep last 5
    setSavedSearches(newSaved);
    localStorage.setItem(`saved-searches-${user.id}`, JSON.stringify(newSaved));
    toast({ title: 'Search Saved', description: 'Your search has been saved for quick access.' });
  };

  const filteredResults = useMemo(() => {
    let filteredArtworks = artworks.filter((artwork) => {
      const matchesQuery =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artists.find(a => a.id === artwork.artistId)?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const categoryMatch = categoryFilter === 'All' || artwork.category === categoryFilter;
      const priceMatch = artwork.price >= priceRange[0] && artwork.price <= priceRange[1];

      // Date range filter (mock - assuming artworks have createdAt)
      const dateMatch = !dateRange.from || !dateRange.to || true; // Placeholder

      return matchesQuery && categoryMatch && priceMatch && dateMatch;
    });

    // Sorting
    filteredArtworks.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return b.id.localeCompare(a.id); // Mock by ID
        case 'popularity': return (b.bids?.length || 0) - (a.bids?.length || 0);
        default: return 0;
      }
    });

    const filteredArtists = artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { artworks: filteredArtworks, artists: filteredArtists };
  }, [searchQuery, categoryFilter, priceRange, sortBy, dateRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <h1 className="font-headline text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Search Artworks</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search artworks, artists, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800"
              />
              {autocompleteSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-b-md shadow-lg z-10">
                  {autocompleteSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900 cursor-pointer"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={saveSearch}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-purple-300 dark:border-purple-700"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-purple-300 dark:border-purple-700 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800 dark:hover:to-pink-800"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {savedSearches.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Saved Searches:</p>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((saved, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery(saved)}
                    className="text-xs"
                  >
                    {saved}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showFilters && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Sort By:</span>
                  <Select onValueChange={setSortBy} defaultValue="relevance">
                    <SelectTrigger className="flex-1 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-800">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Category:</span>
                  <Select onValueChange={setCategoryFilter} defaultValue="All">
                    <SelectTrigger className="flex-1 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-800">
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
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Max Price:</span>
                  <Slider
                    defaultValue={[MAX_PRICE]}
                    max={MAX_PRICE}
                    step={50}
                    onValueChange={(value) => setPriceRange([0, value[0]])}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-16 text-right">${priceRange[1]}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Date Range:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {filteredResults.artists.length > 0 && (
            <section className="bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
              <h2 className="font-headline text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Artists ({filteredResults.artists.length})</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.id}`}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-lg hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800 dark:hover:to-pink-800 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-lg text-purple-800 dark:text-purple-200">{artist.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{artist.bio}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
            <h2 className="font-headline text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Artworks ({filteredResults.artworks.length})
            </h2>
            {filteredResults.artworks.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResults.artworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                <p className="text-muted-foreground text-lg">No artworks found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
