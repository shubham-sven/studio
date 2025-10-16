'use client';

import { useEffect } from 'react';
import type { Artwork } from '@/lib/data';

const BROWSING_HISTORY_KEY = 'artify-browsing-history';
const MAX_HISTORY_LENGTH = 10;

interface ArtworkViewTrackerProps {
  artwork: Pick<Artwork, 'id' | 'title' | 'category'>;
}

export function ArtworkViewTracker({ artwork }: ArtworkViewTrackerProps) {
  useEffect(() => {
    let history = [];
    try {
      const storedHistory = localStorage.getItem(BROWSING_HISTORY_KEY);
      history = storedHistory ? JSON.parse(storedHistory) : [];
    } catch (e) {
      console.error('Failed to parse browsing history:', e);
      history = [];
    }
    
    // Avoid duplicate consecutive entries
    if(history[0]?.artworkId === artwork.id) return;

    const newHistoryEntry = {
      artworkId: artwork.id,
      title: artwork.title,
      category: artwork.category,
    };

    const updatedHistory = [newHistoryEntry, ...history.filter(item => item.artworkId !== artwork.id)];

    if (updatedHistory.length > MAX_HISTORY_LENGTH) {
      updatedHistory.pop();
    }
    
    localStorage.setItem(BROWSING_HISTORY_KEY, JSON.stringify(updatedHistory));

  }, [artwork]);

  return null;
}
