import placeholderImages from './placeholder-images.json';

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarId: string;
}

export interface Bid {
  id: string;
  artworkId: string;
  userId: string;
  userName: string;
  userAvatarId: string;
  amount: number;
  timestamp: string;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  description: string;
  price: number;
  category: 'Abstract' | 'Portrait' | 'Landscape' | 'Digital' | 'Surrealism';
  imageId: string;
  biddingEnabled?: boolean;
  startPrice?: number;
  currentBid?: number;
  auctionEndDate?: string;
  bids?: Bid[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'artist' | 'buyer';
  avatarId: string;
  bio?: string;
  joinedDate: string;
}

export interface Board {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImageId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pin {
  id: string;
  userId: string;
  artworkId: string;
  boardId: string;
  note?: string;
  pinnedAt: string;
}

export interface CartItem {
  id: string;
  artworkId: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  provider: string; // 'visa', 'mastercard', 'paytm', 'gpay', etc.
  last4?: string; // Last 4 digits for cards
  maskedNumber?: string; // Masked card number (e.g., "**** **** **** 4242")
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
  bankCode?: string;
  walletId?: string;
  nickname?: string; // User-defined name for the payment method
  isDefault: boolean;
  isVerified: boolean;
  emiEligible?: boolean; // Whether this card supports EMI
  token?: string; // Secure token for PCI compliance
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  artworkId: string;
  quantity: number;
  price: number; // Price at time of order
  title: string;
  artistId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress?: Address;
  orderDate: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableCategories?: string[];
  createdAt: string;
}

export interface ImageRecord {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export const images: ImageRecord[] = placeholderImages.placeholderImages;

export const users: User[] = [
  {
    id: 'user-123',
    name: 'Casey Buyer',
    email: 'casey@example.com',
    password: 'password123',
    role: 'buyer',
    avatarId: '1015',
    bio: 'Art enthusiast and collector of contemporary pieces.',
    joinedDate: '2023-01-15T00:00:00Z',
  },
  {
    id: 'user-456',
    name: 'Alex',
    email: 'alex@example.com',
    password: 'password123',
    role: 'buyer',
    avatarId: '1005',
    bio: 'Digital art lover and aspiring curator.',
    joinedDate: '2023-03-22T00:00:00Z',
  },
  {
    id: 'user-789',
    name: 'Jordan',
    email: 'jordan@example.com',
    password: 'password123',
    role: 'buyer',
    avatarId: '1005',
    bio: 'Surrealism collector and art blogger.',
    joinedDate: '2023-05-10T00:00:00Z',
  },
];

// Mock user credentials for authentication
export const userCredentials: { [email: string]: { password: string; role: 'artist' | 'buyer' } } = {
  'casey@example.com': { password: 'password123', role: 'buyer' },
  'alex@example.com': { password: 'password123', role: 'buyer' },
  'jordan@example.com': { password: 'password123', role: 'buyer' },
  'arturo@example.com': { password: 'password123', role: 'artist' },
};

export const boards: Board[] = [
  {
    id: 'board-1',
    userId: 'user-123',
    name: 'Modern Abstract',
    description: 'My collection of contemporary abstract artworks',
    coverImageId: '101',
    isPublic: true,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
  },
  {
    id: 'board-2',
    userId: 'user-456',
    name: 'Digital Dreams',
    description: 'Digital and surreal artworks that inspire me',
    coverImageId: '105',
    isPublic: true,
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2023-07-20T00:00:00Z',
  },
  {
    id: 'board-3',
    userId: 'user-789',
    name: 'Classic Masters',
    description: 'Timeless masterpieces from art history',
    coverImageId: '123',
    isPublic: false,
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: '2023-08-10T00:00:00Z',
  },
];

export const pins: Pin[] = [
  {
    id: 'pin-1',
    userId: 'user-123',
    artworkId: 'art-1',
    boardId: 'board-1',
    note: 'Love the vibrant colors!',
    pinnedAt: '2023-06-02T00:00:00Z',
  },
  {
    id: 'pin-2',
    userId: 'user-123',
    artworkId: 'art-7',
    boardId: 'board-1',
    note: 'Perfect for my living room',
    pinnedAt: '2023-06-05T00:00:00Z',
  },
  {
    id: 'pin-3',
    userId: 'user-456',
    artworkId: 'art-5',
    boardId: 'board-2',
    note: 'Mind-bending digital art',
    pinnedAt: '2023-07-02T00:00:00Z',
  },
  {
    id: 'pin-4',
    userId: 'user-456',
    artworkId: 'art-8',
    boardId: 'board-2',
    note: 'Surreal and fascinating',
    pinnedAt: '2023-07-05T00:00:00Z',
  },
  {
    id: 'pin-5',
    userId: 'user-789',
    artworkId: 'art-23',
    boardId: 'board-3',
    note: 'Van Gogh\'s masterpiece',
    pinnedAt: '2023-08-02T00:00:00Z',
  },
  {
    id: 'pin-6',
    userId: 'user-789',
    artworkId: 'art-24',
    boardId: 'board-3',
    note: 'The enigmatic smile',
    pinnedAt: '2023-08-05T00:00:00Z',
  },
];

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
  {
    id: 'artist-4',
    name: 'Pablo Picasso',
    bio: 'Spanish painter, sculptor, printmaker, ceramicist and theatre designer who spent most of his adult life in France. One of the most influential artists of the 20th century.',
    avatarId: '40',
  },
  {
    id: 'artist-5',
    name: 'Frida Kahlo',
    bio: 'Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico. Her work has been celebrated internationally.',
    avatarId: '50',
  },
  {
    id: 'artist-6',
    name: 'Vincent van Gogh',
    bio: 'Dutch Post-Impressionist painter who is among the most famous and influential figures in the history of Western art. Known for his bold colors and dramatic brushwork.',
    avatarId: '60',
  },
  {
    id: 'artist-7',
    name: 'Leonardo da Vinci',
    bio: 'Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor and architect. Considered one of the greatest painters of all time.',
    avatarId: '70',
  },
  {
    id: 'artist-8',
    name: 'Georgia O\'Keeffe',
    bio: 'American modernist artist known for her paintings of enlarged flowers, New York skyscrapers, and New Mexico landscapes. A foundational figure in American modernism.',
    avatarId: '80',
  },
  {
    id: 'artist-9',
    name: 'Banksy',
    bio: 'Pseudonymous England-based street artist, political activist and film director whose real name and identity remain unconfirmed and the subject of speculation.',
    avatarId: '90',
  },
  {
    id: 'artist-10',
    name: 'Yayoi Kusama',
    bio: 'Japanese contemporary artist who works primarily in sculpture and installation, and is also active in painting, performance, film, fashion, poetry, fiction, and other arts.',
    avatarId: '100',
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
    biddingEnabled: true,
    startPrice: 300,
    currentBid: 450,
    auctionEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    bids: [
      { id: 'bid-1', artworkId: 'art-1', userId: 'user-456', userName: 'Alex', userAvatarId: '1005', amount: 350, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 'bid-2', artworkId: 'art-1', userId: 'user-123', userName: 'Casey Buyer', userAvatarId: '1015', amount: 450, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ]
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
    biddingEnabled: true,
    startPrice: 800,
    currentBid: 950,
    auctionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    bids: [
      { id: 'bid-3', artworkId: 'art-5', userId: 'user-789', userName: 'Jordan', userAvatarId: '1005', amount: 950, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ]
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
    biddingEnabled: true,
    startPrice: 400,
    currentBid: 550,
    auctionEndDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    bids: [
       { id: 'bid-4', artworkId: 'art-9', userId: 'user-123', userName: 'Casey Buyer', userAvatarId: '1015', amount: 500, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
       { id: 'bid-5', artworkId: 'art-9', userId: 'user-456', userName: 'Alex', userAvatarId: '1005', amount: 550, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ]
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
    biddingEnabled: true,
    startPrice: 1000,
    currentBid: 1350,
    auctionEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    bids: [
        { id: 'bid-6', artworkId: 'art-17', userId: 'user-789', userName: 'Jordan', userAvatarId: '1005', amount: 1350, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ]
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
  {
    id: 'art-21',
    title: 'Guernica',
    artistId: 'artist-4',
    description: 'A large 1937 oil painting on canvas by Spanish artist Pablo Picasso. It is one of his best-known works, regarded by many art critics as the most moving and powerful anti-war painting in history.',
    price: 25000,
    category: 'Abstract',
    imageId: '121',
  },
  {
    id: 'art-22',
    title: 'The Two Fridas',
    artistId: 'artist-5',
    description: 'A double self-portrait painted by Mexican artist Frida Kahlo in 1939. The painting was the first large-scale work done by Kahlo and is considered one of her most notable paintings.',
    price: 8500,
    category: 'Portrait',
    imageId: '122',
  },
  {
    id: 'art-23',
    title: 'Starry Night',
    artistId: 'artist-6',
    description: 'A post-impressionist painting by Dutch artist Vincent van Gogh. Painted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence.',
    price: 15000,
    category: 'Landscape',
    imageId: '123',
  },
  {
    id: 'art-24',
    title: 'Mona Lisa',
    artistId: 'artist-7',
    description: 'A half-length portrait painting by Italian artist Leonardo da Vinci. Considered an archetypal masterpiece of the Italian Renaissance, it has been described as "the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world."',
    price: 30000,
    category: 'Portrait',
    imageId: '124',
  },
  {
    id: 'art-25',
    title: 'Red Poppy',
    artistId: 'artist-8',
    description: 'A 1928 painting by American artist Georgia O\'Keeffe. This painting is one of O\'Keeffe\'s most famous works and exemplifies her style of close-up flower paintings.',
    price: 12000,
    category: 'Abstract',
    imageId: '125',
  },
  {
    id: 'art-26',
    title: 'Girl with Balloon',
    artistId: 'artist-9',
    description: 'A series of stencil graffiti artworks by Banksy, first created in 2002. The image has been widely recreated and has become one of Banksy\'s most iconic works.',
    price: 1800,
    category: 'Digital',
    imageId: '126',
  },
  {
    id: 'art-27',
    title: 'Pumpkin',
    artistId: 'artist-10',
    description: 'A 1994 sculpture by Japanese artist Yayoi Kusama. This work is part of her ongoing series of brightly colored pumpkin sculptures that have become iconic in contemporary art.',
    price: 9500,
    category: 'Surrealism',
    imageId: '127',
  },
  {
    id: 'art-28',
    title: 'Les Demoiselles d\'Avignon',
    artistId: 'artist-4',
    description: 'A large oil painting created in 1907 by Spanish artist Pablo Picasso. The work portrays five nude female prostitutes from a brothel on Carrer d\'Avinyó in Barcelona.',
    price: 22000,
    category: 'Abstract',
    imageId: '128',
  },
  {
    id: 'art-29',
    title: 'The Persistence of Memory',
    artistId: 'artist-6',
    description: 'A 1931 painting by artist Salvador Dalí and one of the most recognizable works of Surrealism. It features a number of melting clocks in a landscape setting.',
    price: 13500,
    category: 'Surrealism',
    imageId: '129',
  },
  {
    id: 'art-30',
    title: 'The Great Wave off Kanagawa',
    artistId: 'artist-7',
    description: 'A woodblock print by Japanese ukiyo-e artist Hokusai, created in 1831. It is Hokusai\'s most famous work and is often considered the most recognizable Japanese artwork in the world.',
    price: 7500,
    category: 'Landscape',
    imageId: '130',
  },
  {
    id: 'art-31',
    title: 'The Weeping Woman',
    artistId: 'artist-4',
    description: 'A painting by Pablo Picasso that he created in 1937 as a response to the bombing of Guernica. It depicts a woman in mourning, with tears streaming down her face.',
    price: 18000,
    category: 'Portrait',
    imageId: '131',
  },
  {
    id: 'art-32',
    title: 'Self-Portrait with Thorn Necklace and Hummingbird',
    artistId: 'artist-5',
    description: 'A 1940 self-portrait by Frida Kahlo featuring a thorn necklace and a dead hummingbird. It symbolizes pain, death, and Mexican culture.',
    price: 9200,
    category: 'Portrait',
    imageId: '132',
  },
  {
    id: 'art-33',
    title: 'Sunflowers',
    artistId: 'artist-6',
    description: 'A series of still life paintings by Vincent van Gogh featuring sunflowers. This particular version was painted in 1888 and is one of his most famous works.',
    price: 16500,
    category: 'Portrait',
    imageId: '133',
  },
  {
    id: 'art-34',
    title: 'The Last Supper',
    artistId: 'artist-7',
    description: 'A mural painting by Leonardo da Vinci created between 1495 and 1498. It depicts the scene of the Last Supper of Jesus with his apostles.',
    price: 28000,
    category: 'Portrait',
    imageId: '134',
  },
  {
    id: 'art-35',
    title: 'Black Iris',
    artistId: 'artist-8',
    description: 'A 1926 painting by Georgia O\'Keeffe featuring a close-up view of an iris flower. It exemplifies her style of enlarged botanical subjects.',
    price: 11000,
    category: 'Abstract',
    imageId: '135',
  },
  {
    id: 'art-36',
    title: 'Flower Thrower',
    artistId: 'artist-9',
    description: 'A 2003 stencil graffiti artwork by Banksy depicting a masked protester throwing a bouquet of flowers instead of a Molotov cocktail.',
    price: 2200,
    category: 'Digital',
    imageId: '136',
  },
  {
    id: 'art-37',
    title: 'Infinity Mirrored Room - The Souls of Millions of Light Years Away',
    artistId: 'artist-10',
    description: 'An installation artwork by Yayoi Kusama from 2013, featuring a mirrored room filled with LED lights that create an infinite space.',
    price: 12500,
    category: 'Surrealism',
    imageId: '137',
  },
  {
    id: 'art-38',
    title: 'Blue Period Portrait',
    artistId: 'artist-4',
    description: 'A painting from Pablo Picasso\'s Blue Period (1901-1904), characterized by monochromatic blue tones and themes of poverty and despair.',
    price: 19500,
    category: 'Portrait',
    imageId: '138',
  },
  {
    id: 'art-39',
    title: 'The Broken Column',
    artistId: 'artist-5',
    description: 'A 1944 self-portrait by Frida Kahlo depicting her body as a broken classical column, symbolizing the pain from her injuries and surgeries.',
    price: 8800,
    category: 'Portrait',
    imageId: '139',
  },
  {
    id: 'art-40',
    title: 'Café Terrace at Night',
    artistId: 'artist-6',
    description: 'A 1888 painting by Vincent van Gogh depicting the exterior of a café in Arles at night, featuring his characteristic swirling brushstrokes.',
    price: 14200,
    category: 'Landscape',
    imageId: '140',
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

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function getBoardsByUser(userId: string): Board[] {
  return boards.filter((board) => board.userId === userId);
}

export function getBoardById(id: string): Board | undefined {
  return boards.find((board) => board.id === id);
}

export function getPinsByBoard(boardId: string): Pin[] {
  return pins.filter((pin) => pin.boardId === boardId);
}

export function getPinsByUser(userId: string): Pin[] {
  return pins.filter((pin) => pin.userId === userId);
}

export function getPublicBoards(): Board[] {
  return boards.filter((board) => board.isPublic);
}

export function getCartByUserId(userId: string): Cart | undefined {
  // Mock cart data - in real app this would come from database
  const mockCart: Cart = {
    id: `cart-${userId}`,
    userId,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockCart;
}

export function addItemToCart(userId: string, artworkId: string, quantity: number = 1): Cart {
  // Mock implementation - in real app this would update database
  const cart = getCartByUserId(userId) || {
    id: `cart-${userId}`,
    userId,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingItem = cart.items.find(item => item.artworkId === artworkId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      id: `cart-item-${Date.now()}`,
      artworkId,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  cart.updatedAt = new Date().toISOString();
  return cart;
}

export function removeItemFromCart(userId: string, cartItemId: string): Cart | null {
  // Mock implementation - in real app this would update database
  const cart = getCartByUserId(userId);
  if (!cart) return null;

  cart.items = cart.items.filter(item => item.id !== cartItemId);
  cart.updatedAt = new Date().toISOString();
  return cart;
}

export function updateCartItemQuantity(userId: string, cartItemId: string, quantity: number): Cart | null {
  // Mock implementation - in real app this would update database
  const cart = getCartByUserId(userId);
  if (!cart) return null;

  const item = cart.items.find(item => item.id === cartItemId);
  if (item) {
    item.quantity = quantity;
    cart.updatedAt = new Date().toISOString();
  }
  return cart;
}

export function clearCart(userId: string): Cart | null {
  // Mock implementation - in real app this would update database
  const cart = getCartByUserId(userId);
  if (!cart) return null;

  cart.items = [];
  cart.updatedAt = new Date().toISOString();
  return cart;
}
