'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Artwork } from '@/lib/data';

const FAVORITES_KEY = 'artify-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Artwork[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error);
      setFavorites([]);
    }
  }, []);

  const updateFavorites = useCallback((newFavorites: Artwork[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  const addFavorite = useCallback(
    (artwork: Artwork) => {
      updateFavorites([...favorites, artwork]);
    },
    [favorites, updateFavorites]
  );

  const removeFavorite = useCallback(
    (artworkId: string) => {
      updateFavorites(favorites.filter((fav) => fav.id !== artworkId));
    },
    [favorites, updateFavorites]
  );

  const isFavorite = useCallback(
    (artworkId: string) => {
      return favorites.some((fav) => fav.id === artworkId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (artwork: Artwork) => {
      if (isFavorite(artwork.id)) {
        removeFavorite(artwork.id);
      } else {
        addFavorite(artwork);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, toggleFavorite, isFavorite, addFavorite, removeFavorite };
}
