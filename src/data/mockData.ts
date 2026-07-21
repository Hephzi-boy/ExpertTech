export type Story = {
  id: string;
  name: string;
  role: string;
  imageUri: string;
  accent: string;
  avatarWidth: number;
  avatarHeight: number;
  avatarOffsetX: number;
  avatarOffsetY: number;
};

export type CommunityPost = {
  id: string;
  author: string;
  audience: string;
  category: string;
  postedAt: string;
  avatarUri: string;
  avatarVariant?: 'maurice' | 'boyd' | 'stranger' | 'felix';
  avatarRingColor?: string;
  useReferenceAvatar?: boolean;
  message: string;
  location: string;
  statusLabel?: string;
  statusTone?: 'rent' | 'sale';
  imageUri?: string;
  imageAssetVariant?: 'point3d_exterior' | 'point3d_interior';
  mediaKind?: 'image' | 'carousel' | 'video';
  mediaAspectRatio?: number;
  mediaDotCount?: number;
  activeDotIndex?: number;
  durationLabel?: string;
  likes: number;
  comments: number;
  saves: number;
  likedByHandle: string;
  otherLikes: number;
  likedByAvatars: string[];
};

export type Listing = {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  authorAccent: string;
  marketType?: 'buy' | 'rent' | 'shortlet';
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  postedAt: string;
  caption: string;
  imageUri?: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  verified?: boolean;
};

export const stories: Story[] = [
  {
    id: 'story-1',
    name: 'Alex',
    role: 'Featured',
    imageUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    accent: '#FF8A3D',
    avatarWidth: 59,
    avatarHeight: 88.5,
    avatarOffsetX: 0.05,
    avatarOffsetY: 0.46,
  },
  {
    id: 'story-2',
    name: 'Jordan',
    role: 'Featured',
    imageUri:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=240&q=80',
    accent: '#3BE178',
    avatarWidth: 88.56,
    avatarHeight: 59,
    avatarOffsetX: -14.8,
    avatarOffsetY: 0,
  },
  {
    id: 'story-3',
    name: 'Taylor',
    role: 'Featured',
    imageUri:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=240&q=80',
    accent: '#6AE0FF',
    avatarWidth: 59,
    avatarHeight: 73.75,
    avatarOffsetX: 0,
    avatarOffsetY: -7.38,
  },
  {
    id: 'story-4',
    name: 'Jamie',
    role: 'Featured',
    imageUri:
      'https://images.unsplash.com/photo-1714463730206-24e9fc55dd8a?auto=format&fit=crop&w=240&q=80',
    accent: '#FFC46C',
    avatarWidth: 59,
    avatarHeight: 88.5,
    avatarOffsetX: 0,
    avatarOffsetY: -1,
  },
  {
    id: 'story-5',
    name: 'Jordan',
    role: 'Featured',
    imageUri:
      'https://images.unsplash.com/photo-1683135231682-51fb7eb05749?auto=format&fit=crop&w=240&q=80',
    accent: '#FF76A8',
    avatarWidth: 52,
    avatarHeight: 78,
    avatarOffsetX: 3.5,
    avatarOffsetY: 5,
  },
  {
    id: 'story-6',
    name: 'Emily',
    role: 'Featured',
    imageUri:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80',
    accent: '#2F8F63',
    avatarWidth: 59,
    avatarHeight: 88.5,
    avatarOffsetX: 0,
    avatarOffsetY: -14.75,
  },
];

export const listings: Listing[] = [
  {
    id: 'listing-1',
    author: 'Marvis A.',
    authorRole: 'Verified broker',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    authorAccent: '#FF8A3D',
    marketType: 'shortlet',
    title: 'Modern duplex in Lekki Phase 1',
    location: 'Chevron Drive, Lagos',
    price: 'NGN 180,000 / night',
    beds: 4,
    baths: 5,
    area: '430 sqm',
    postedAt: '4h ago',
    caption:
      'Warm lighting, quiet street access, and concierge-ready service for short stays or executive shoots.',
    likes: 56,
    comments: 18,
    views: 201,
    tags: ['Shortlet', 'Featured', 'Verified'],
    verified: true,
  },
  {
    id: 'listing-2',
    author: 'Bayo Prime',
    authorRole: 'Luxury host',
    authorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    authorAccent: '#3BE178',
    marketType: 'buy',
    title: 'Glass-front villa with private courtyard',
    location: 'Ikate, Lekki',
    price: 'NGN 240,000 / night',
    beds: 5,
    baths: 6,
    area: '520 sqm',
    postedAt: '7h ago',
    caption:
      'Floor-to-ceiling glazing, sharp landscaping, and a calm layout built for premium guests.',
    imageUri:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    likes: 33,
    comments: 9,
    views: 148,
    tags: ['Villa', 'Pool', 'Top rated'],
    verified: true,
  },
  {
    id: 'listing-3',
    author: 'Seyor Homes',
    authorRole: 'Property curator',
    authorAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    authorAccent: '#6AE0FF',
    marketType: 'buy',
    title: 'Architectural family home with clean lines',
    location: 'Banana Island, Lagos',
    price: 'NGN 410,000 / night',
    beds: 6,
    baths: 7,
    area: '690 sqm',
    postedAt: '12h ago',
    caption:
      'Minimal silhouette, soft landscaping, and generous indoor-outdoor transitions across the entire build.',
    imageUri:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    likes: 29,
    comments: 12,
    views: 189,
    tags: ['Executive', 'Waterfront'],
  },
  {
    id: 'listing-4',
    author: 'Puls Casa',
    authorRole: 'Interior partner',
    authorAvatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=240&q=80',
    authorAccent: '#FFC46C',
    marketType: 'rent',
    title: 'Curated apartment with gallery-toned interior',
    location: 'Victoria Island, Lagos',
    price: 'NGN 95,000 / night',
    beds: 2,
    baths: 2,
    area: '170 sqm',
    postedAt: '1d ago',
    caption:
      'Muted colors, custom shelving, and a lived-in lounge mood for founders, creators, and brand shoots.',
    imageUri:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    likes: 21,
    comments: 6,
    views: 102,
    tags: ['Apartment', 'Design-led'],
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Maurice U',
    audience: 'Individual',
    category: 'General',
    postedAt: 'Just Now',
    avatarVariant: 'maurice',
    useReferenceAvatar: true,
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    message:
      'How is everyone holding up with the flooding in Lekki this week? Stay safe out there - and let me know if anyone needs a temporary place to crash 🙏',
    location: 'Lekki Phase 1, Lagos',
    likes: 8,
    comments: 8,
    saves: 2,
    likedByHandle: 'miracle.h',
    otherLikes: 7,
    likedByAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    ],
  },
  {
    id: 'post-2',
    author: 'Boyd From',
    audience: 'Developer',
    category: 'Property',
    postedAt: '2h',
    avatarVariant: 'boyd',
    avatarUri:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    avatarRingColor: '#22D3A1',
    message:
      'Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
    location: 'Lekki Phase 1, Lagos',
    statusLabel: 'For Rent',
    statusTone: 'rent',
    imageAssetVariant: 'point3d_exterior',
    imageUri:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    mediaKind: 'image',
    mediaAspectRatio: 680 / 520,
    likes: 23,
    comments: 0,
    saves: 2,
    likedByHandle: 'miracle.h',
    otherLikes: 22,
    likedByAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    ],
  },
  {
    id: 'post-3',
    author: 'Stranger Dan',
    audience: 'Agent',
    category: 'General',
    postedAt: '20m',
    avatarVariant: 'stranger',
    avatarUri:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    message:
      'Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.',
    location: 'Lekki Phase 1, Lagos',
    statusLabel: 'For Sale',
    statusTone: 'sale',
    imageAssetVariant: 'point3d_exterior',
    imageUri:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    mediaKind: 'carousel',
    mediaAspectRatio: 680 / 520,
    mediaDotCount: 4,
    activeDotIndex: 0,
    likes: 23,
    comments: 3,
    saves: 2,
    likedByHandle: 'miracle.h',
    otherLikes: 22,
    likedByAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    ],
  },
  {
    id: 'post-4',
    author: 'Felix Okon',
    audience: 'Broker',
    category: 'Property',
    postedAt: '21h',
    avatarVariant: 'felix',
    avatarUri:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
    message:
      'New 2-bedroom apartment in Yaba or Akoka. Must have constant water and parking for one car. Moving in by end of next month.',
    location: 'Lekki Phase 1, Lagos',
    statusLabel: 'For Sale',
    statusTone: 'sale',
    imageAssetVariant: 'point3d_interior',
    imageUri:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    mediaKind: 'video',
    mediaAspectRatio: 559 / 866,
    durationLabel: '0:20',
    likes: 1,
    comments: 0,
    saves: 0,
    likedByHandle: 'miracle.h',
    otherLikes: 0,
    likedByAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    ],
  },
];

export const exploreFilters = ['All', 'Shortlet', 'Buy', 'Rent', 'Top rated'];

export const savedBoards = [
  {
    id: 'board-1',
    name: 'Weekend stays',
    count: 12,
  },
  {
    id: 'board-2',
    name: 'Client tours',
    count: 8,
  },
  {
    id: 'board-3',
    name: 'Shoot locations',
    count: 5,
  },
];

export const profileActions = [
  'Account settings',
  'Listing analytics',
  'Verification status',
  'Saved payment methods',
];
