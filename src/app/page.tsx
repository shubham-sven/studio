'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { artworks } from '@/lib/data';
import HomePageClient from '@/components/home-page-client';
import { FeaturedCarousel } from '@/components/featured-carousel';
import { TrendingArtists } from '@/components/trending-artists';
import { AnimatedStats } from '@/components/animated-stats';
import { FloatingActionButton } from '@/components/floating-action-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with Modern Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>

        {/* Animated Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Wave Overlay */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="0.1" d="M0,64L160,160L320,256L480,96L640,288L800,288L960,64L1120,192L1280,160L1440,224L1440,320L1280,320L1120,320L960,320L800,320L640,320L480,320L320,320L160,320L0,320Z"></path>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center text-white max-w-5xl mx-auto">
            {/* Main Title */}
            <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
              Artify
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl font-light mb-8 text-blue-100 leading-relaxed">
              Where Creativity Meets the Digital Canvas
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover extraordinary artworks from talented artists worldwide. Explore, collect, and own digital masterpieces that tell stories and inspire imagination.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/search">
                <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  Explore Artworks
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  Become an Artist
                </button>
              </Link>
              <Link href="/upload">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  Upload Art
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-200">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">5K+</div>
                <div className="text-blue-200">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-blue-200">Collectors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carousel Section */}
      <section className="relative bg-white dark:bg-slate-900 py-16">
        <FeaturedCarousel />
      </section>

      {/* Trending Artists Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 py-16">
        <TrendingArtists />
      </section>

      {/* Animated Stats Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <AnimatedStats />
      </section>

      {/* Content Section */}
      <div className="relative bg-white dark:bg-slate-900">
        <HomePageClient initialArtworks={artworks} />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
