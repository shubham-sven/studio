import placeholderImages from './placeholder-images.json';

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarId: string;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  description: string;
  price: number;
  category: 'Abstract' | 'Portrait' | 'Landscape' | 'Digital' | 'Surrealism';
  imageId: string;
}

export interface ImageRecord {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export const images: ImageRecord[] = placeholderImages.placeholderImages;

export const artists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Elena Petrova',
    bio: 'An abstract artist from Kyiv, Elena explores the relationship between color and emotion, creating vibrant canvases that speak to the soul.',
    avatarId: '10',
  },
  {
    id: 'artist-2',
    name: 'Kenji Tanaka',
    bio: 'Based in Tokyo, Kenji is a master of digital surrealism. His work often features dreamlike landscapes and impossible architecture.',
    avatarId: '20',
  },
  {
    id: 'artist-3',
    name: 'Maria Garcia',
    bio: 'A portrait artist from Madrid, Maria captures the essence of her subjects with a unique blend of classical technique and modern flair.',
    avatarId: '30',
  },
];

export const artworks: Artwork[] = [
  {
    id: 'art-1',
    title: 'Chromatic Pulse',
    artistId: 'artist-1',
    description: 'A dynamic explosion of color, representing the chaotic yet beautiful nature of urban life.',
    price: 450,
    category: 'Abstract',
    imageId: '101',
  },
  {
    id: 'art-2',
    title: 'The Whispering City',
    artistId: 'artist-2',
    description: 'A surreal cityscape that seems to float in a twilight sky, where buildings whisper secrets to the moon.',
    price: 780,
    category: 'Surrealism',
    imageId: '102',
  },
  {
    id: 'art-3',
    title: 'Serenity in Crimson',
    artistId: 'artist-3',
    description: 'A powerful portrait capturing a moment of quiet contemplation and inner strength.',
    price: 600,
    category: 'Portrait',
    imageId: '103',
  },
  {
    id: 'art-4',
    title: 'Emerald Valley',
    artistId: 'artist-1',
    description: 'An abstract interpretation of a lush landscape, focusing on the interplay of light and shadow.',
    price: 320,
    category: 'Landscape',
    imageId: '104',
  },
  {
    id: 'art-5',
    title: 'Digital Dreamscape',
    artistId: 'artist-2',
    description: 'A purely digital creation that bends the rules of physics, inviting the viewer into a different reality.',
    price: 950,
    category: 'Digital',
    imageId: '105',
  },
  {
    id: 'art-6',
    title: 'The Scholar',
    artistId: 'artist-3',
    description: 'A portrait of an old scholar, with eyes that tell a thousand stories of knowledge and time.',
    price: 820,
    category: 'Portrait',
    imageId: '106',
  },
  {
    id: 'art-7',
    title: 'Oceanic Flow',
    artistId: 'artist-1',
    description: 'Inspired by the deep sea, this abstract piece uses flowing lines and deep blues to evoke a sense of calm.',
    price: 530,
    category: 'Abstract',
    imageId: '107',
  },
  {
    id: 'art-8',
    title: 'The Clockwork Forest',
    artistId: 'artist-2',
    description: 'A surrealist painting of a forest where trees are made of gears and time flows like a river.',
    price: 1200,
    category: 'Surrealism',
    imageId: '108',
  },
  {
    id: 'art-9',
    title: 'Ephemeral Gaze',
    artistId: 'artist-3',
    description: 'A delicate portrait capturing a fleeting expression, a mix of melancholy and hope.',
    price: 550,
    category: 'Portrait',
    imageId: '109',
  },
   {
    id: 'art-10',
    title: 'Silicon Sunrise',
    artistId: 'artist-2',
    description: 'A digital landscape where a sun made of data rises over a circuit board mountain range.',
    price: 680,
    category: 'Digital',
    imageId: '110',
  },
  {
    id: 'art-11',
    title: 'Rhapsody in Blue',
    artistId: 'artist-1',
    description: 'A canvas dominated by various shades of blue, exploring themes of peace, sadness, and infinity.',
    price: 480,
    category: 'Abstract',
    imageId: '111',
  },
  {
    id: 'art-12',
    title: 'The Wanderer',
    artistId: 'artist-3',
    description: 'A portrait of a lone figure against a vast, empty landscape, symbolizing a journey of self-discovery.',
    price: 710,
    category: 'Landscape',
    imageId: '112',
  },
  {
    id: 'art-13',
    title: 'Metropolis in Motion',
    artistId: 'artist-1',
    description: 'An abstract piece capturing the frenetic energy of a bustling city at night.',
    price: 580,
    category: 'Abstract',
    imageId: '113',
  },
  {
    id: 'art-14',
    title: 'The Glimmering Shore',
    artistId: 'artist-3',
    description: 'A serene landscape painting of a beach at sunset, with light dancing on the waves.',
    price: 420,
    category: 'Landscape',
    imageId: '114',
  },
  {
    id: 'art-15',
    title: 'Cybernetic Bloom',
    artistId: 'artist-2',
    description: 'A digital artwork depicting a flower made of wires and circuits, blossoming with light.',
    price: 880,
    category: 'Digital',
    imageId: '115',
  },
  {
    id: 'art-16',
    title: 'The Jester\'s Tears',
    artistId: 'artist-3',
    description: 'A poignant portrait of a clown, revealing the sadness behind the painted smile.',
    price: 750,
    category: 'Portrait',
    imageId: '116',
  },
  {
    id: 'art-17',
    title: 'Gravity\'s Rainbow',
    artistId: 'artist-2',
    description: 'A surrealist vision of a world where gravity is a spectrum of colors, pulling objects in different directions.',
    price: 1350,
    category: 'Surrealism',
    imageId: '117',
  },
  {
    id: 'art-18',
    title: 'Whispers of the Wind',
    artistId: 'artist-1',
    description: 'An abstract landscape where the movement of wind is visualized through flowing, gentle brushstrokes.',
    price: 390,
    category: 'Landscape',
    imageId: '118',
  },
  {
    id: 'art-19',
    title: 'Neural Nexus',
    artistId: 'artist-2',
    description: 'A complex digital piece illustrating the intricate and beautiful connections of a neural network.',
    price: 1100,
    category: 'Digital',
    imageId: '119',
  },
  {
    id: 'art-20',
    title: 'Echoes of a Dream',
    artistId: 'artist-1',
    description: 'A dreamlike abstract painting that plays with memory, form, and ethereal light.',
    price: 620,
    category: 'Surrealism',
    imageId: '120',
  },
];

// Helper functions to simulate database queries
export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id);
}

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((artwork) => artwork.id === id);
}

export function getArtworksByArtist(artistId: string): Artwork[] {
  return artworks.filter((artwork) => artwork.artistId === artistId);
}

export function findImageById(id: string): ImageRecord | undefined {
    return images.find(img => img.id === id);
}
