// ─────────────────────────────────────────────────────────────────────────────
// LocalLoop – centralny plik danych aplikacji (REFACTORED)
// ─────────────────────────────────────────────────────────────────────────────

// ── Typy ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarColor: string;
  memberSince: string;
  neighborhood: string;
  bio: string;
  impactScore: number;
  exchangesCount: number;
  communityHealth: number;
  isCurrentUser?: boolean;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  image: string;
  status: 'active' | 'completed' | 'pending';
  category: string;
  createdAt: string;
  views: number;
  interestedCount: number;
  // Specific to listing type
  listingType: 'offer' | 'request';
  // Value suggestions
  suggestedBarter?: string;
  suggestedPoints?: number;
  // For completed listings
  completedWith?: string;
  completedWithUserId?: string;
  completedAt?: string;
}

export interface ActivityItem {
  id: string;
  listingId: string;
  userId: string;
  action: 'created_offer' | 'created_request' | 'completed_exchange' | 'liked_listing';
  timestamp: string;
  likes: number;
}

export interface Conversation {
  id: string;
  participants: string[]; // userIds
  listingId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadFor: string[]; // userIds who have unread messages
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromUserId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface FavorCategory {
  id: string;
  label: string;
  iconName: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface CommunityStats {
  communityHealth: number;
  totalExchanges: number;
  impactScore: number;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Jan Kowalski',
    initials: 'JK',
    email: 'jan.kowalski@email.com',
    avatarColor: 'from-[#89cff0]/20 to-[#7dd3c0]/20',
    memberSince: 'Styczeń 2024',
    neighborhood: 'Śródmieście, Gdynia',
    bio: 'Pasjonat ekologii i lokalnej społeczności. Wierzę, że razem możemy tworzyć lepsze sąsiedztwo!',
    impactScore: 12,
    exchangesCount: 8,
    communityHealth: 87,
    isCurrentUser: true,
  },
  {
    id: 'user-2',
    name: 'Anna Kowalska',
    initials: 'AK',
    email: 'anna.k@email.com',
    avatarColor: 'from-[#7dd3c0] to-[#a8d5ba]',
    memberSince: 'Marzec 2023',
    neighborhood: 'Witomino, Gdynia',
    bio: 'Lubię pomagać sąsiadom!',
    impactScore: 34,
    exchangesCount: 22,
    communityHealth: 95,
  },
  {
    id: 'user-3',
    name: 'Piotr Nowak',
    initials: 'PN',
    email: 'piotr.n@email.com',
    avatarColor: 'from-[#89cff0] to-[#7dd3c0]',
    memberSince: 'Luty 2023',
    neighborhood: 'Redłowo, Gdynia',
    bio: 'Mechanik z pasją.',
    impactScore: 28,
    exchangesCount: 17,
    communityHealth: 90,
  },
  {
    id: 'user-4',
    name: 'Ewa Wiśniewska',
    initials: 'EW',
    email: 'ewa.w@email.com',
    avatarColor: 'from-[#a8d5ba] to-[#c2e7d9]',
    memberSince: 'Kwiecień 2023',
    neighborhood: 'Orłowo, Gdynia',
    bio: 'Piekę i dzielę się z sąsiadami.',
    impactScore: 41,
    exchangesCount: 31,
    communityHealth: 98,
  },
  {
    id: 'user-5',
    name: 'Marek Zieliński',
    initials: 'MZ',
    email: 'marek.z@email.com',
    avatarColor: 'from-[#b8d8e8] to-[#89cff0]',
    memberSince: 'Czerwiec 2023',
    neighborhood: 'Grabówek, Gdynia',
    bio: 'Ogrodnik amator.',
    impactScore: 18,
    exchangesCount: 11,
    communityHealth: 82,
  },
  {
    id: 'user-6',
    name: 'Kasia Szymańska',
    initials: 'KS',
    email: 'kasia.s@email.com',
    avatarColor: 'from-[#7dd3c0] to-[#89cff0]',
    memberSince: 'Styczeń 2024',
    neighborhood: 'Wzgórze Św. Maksymiliana, Gdynia',
    bio: 'Miłośniczka gotowania.',
    impactScore: 22,
    exchangesCount: 14,
    communityHealth: 88,
  },
  {
    id: 'user-7',
    name: 'Tomasz Kowalczyk',
    initials: 'TK',
    email: 'tomasz.k@email.com',
    avatarColor: 'from-[#a8d5ba] to-[#7dd3c0]',
    memberSince: 'Sierpień 2023',
    neighborhood: 'Działki Leśne, Gdynia',
    bio: 'Lubię naprawiać i dawać drugie życie rzeczom.',
    impactScore: 55,
    exchangesCount: 43,
    communityHealth: 99,
  },
];

export const currentUser = users.find(u => u.isCurrentUser)!;

// Helper function to get user by ID
export const getUserById = (userId: string): User | undefined => {
  return users.find(u => u.id === userId);
};

// ── Listings (Single source of truth) ─────────────────────────────────────────

export const listings: Listing[] = [
  // OFFERS (services/goods offered by users)
  {
    id: 'lst-1',
    ownerId: 'user-1',
    title: 'Wiertarka udarowa Bosch Professional',
    description: 'Wiertarka udarowa Bosch Professional w świetnym stanie, z baterią i ładowarką. Idealna do montażu mebli czy drobnych napraw. Chętnie podzielę się nią z sąsiadami! 🌱',
    image: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=400',
    status: 'active',
    category: 'Narzędzia',
    createdAt: '2024-01-15T10:00:00Z',
    views: 24,
    interestedCount: 3,
    listingType: 'offer',
    suggestedBarter: 'Ciasto drożdżowe lub pomoc w ogrodzie',
    suggestedPoints: 85,
  },
  {
    id: 'lst-2',
    ownerId: 'user-1',
    title: 'Sekator ogrodowy',
    description: 'Sekator ogrodowy w dobrym stanie, idealny do przycinania krzewów i drzewek.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    status: 'active',
    category: 'Ogród',
    createdAt: '2024-01-20T10:00:00Z',
    views: 12,
    interestedCount: 1,
    listingType: 'offer',
    suggestedBarter: 'Świeże zioła lub pomoc w ogrodzie',
    suggestedPoints: 45,
  },
  {
    id: 'lst-3',
    ownerId: 'user-2',
    title: 'Korepetycje z matematyki',
    description: 'Oferuję korepetycje z matematyki dla szkół podstawowych i średnich. Doświadczenie 5 lat.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    status: 'active',
    category: 'Edukacja',
    createdAt: '2024-01-18T10:00:00Z',
    views: 45,
    interestedCount: 5,
    listingType: 'offer',
    suggestedBarter: 'Wymiana na pomoc w ogrodzie lub domowe wypieki',
    suggestedPoints: 100,
  },
  {
    id: 'lst-4',
    ownerId: 'user-3',
    title: 'Pomoc w naprawie roweru',
    description: 'Jestem mechanikiem rowerowym z pasją. Pomogę w regulacji przerzutek, hamulców i podstawowych naprawach.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
    status: 'active',
    category: 'Naprawa',
    createdAt: '2024-01-19T10:00:00Z',
    views: 32,
    interestedCount: 4,
    listingType: 'offer',
    suggestedBarter: 'Domowe ciasto lub pomoc w ogrodzie',
    suggestedPoints: 60,
  },
  {
    id: 'lst-5',
    ownerId: 'user-4',
    title: 'Domowe wypieki',
    description: 'Piekę pyszne drożdżówki, ciasta i chleb. Mogę podzielić się z sąsiadami!',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    status: 'active',
    category: 'Jedzenie',
    createdAt: '2024-01-21T10:00:00Z',
    views: 67,
    interestedCount: 12,
    listingType: 'offer',
    suggestedBarter: 'Wymiana na warzywa z ogrodu lub pomoc w ogrodzie',
    suggestedPoints: 30,
  },
  {
    id: 'lst-6',
    ownerId: 'user-5',
    title: 'Kosiarka elektryczna',
    description: 'Kosiarka elektryczna, sprawna i gotowa do użycia. Idealna do małych ogrodów.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    status: 'active',
    category: 'Dom i Ogród',
    createdAt: '2024-01-22T10:00:00Z',
    views: 18,
    interestedCount: 2,
    listingType: 'offer',
    suggestedBarter: 'Pomoc w ogrodzie w zamian',
    suggestedPoints: 70,
  },
  {
    id: 'lst-7',
    ownerId: 'user-7',
    title: 'Drabina aluminiowa',
    description: 'Drabina aluminiowa 4-stopniowa, stabilna i lekka.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    status: 'completed',
    category: 'Narzędzia',
    createdAt: '2023-12-01T10:00:00Z',
    views: 89,
    interestedCount: 7,
    listingType: 'offer',
    completedWith: 'Piotr N.',
    completedWithUserId: 'user-3',
    completedAt: '2023-12-15T10:00:00Z',
  },
  
  // REQUESTS (help requests from users)
  {
    id: 'req-1',
    ownerId: 'user-2',
    title: 'Pomoc w przeprowadzce',
    description: 'Potrzebuję pomocy przy wniesieniu mebli na 3 piętro. Brak windy.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    status: 'active',
    category: 'Transport',
    createdAt: '2024-01-23T10:00:00Z',
    views: 56,
    interestedCount: 3,
    listingType: 'request',
    suggestedBarter: 'Domowe ciasto lub 50 punktów społecznościowych',
    suggestedPoints: 50,
  },
  {
    id: 'req-2',
    ownerId: 'user-3',
    title: 'Naprawa roweru - potrzebuję pomocy',
    description: 'Mój rower wymaga regulacji przerzutek. Ktoś pomoże?',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
    status: 'active',
    category: 'Naprawa',
    createdAt: '2024-01-24T10:00:00Z',
    views: 34,
    interestedCount: 2,
    listingType: 'request',
    suggestedBarter: 'Pomoc w ogrodzie w zamian',
    suggestedPoints: 40,
  },
  {
    id: 'req-3',
    ownerId: 'user-4',
    title: 'Korepetycje z angielskiego dla dziecka',
    description: 'Szukam korepetytora z angielskiego dla 10-letniego syna. 2 razy w tygodniu.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400',
    status: 'active',
    category: 'Edukacja',
    createdAt: '2024-01-25T10:00:00Z',
    views: 28,
    interestedCount: 1,
    listingType: 'request',
    suggestedBarter: 'Wymiana na domowe wypieki',
    suggestedPoints: 80,
  },
  {
    id: 'req-4',
    ownerId: 'user-5',
    title: 'Pożyczenie kosiarki',
    description: 'Czy ktoś mógłby pożyczyć kosiarkę na weekend? Moja się zepsuła.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    status: 'active',
    category: 'Dom i Ogród',
    createdAt: '2024-01-26T10:00:00Z',
    views: 42,
    interestedCount: 4,
    listingType: 'request',
    suggestedBarter: 'Pomoc w ogrodzie w zamian',
    suggestedPoints: 60,
  },
  {
    id: 'req-5',
    ownerId: 'user-6',
    title: 'Transport mebli',
    description: 'Potrzebuję przewieźć sofę z Ikei do domu. Ktoś z samochodem?',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    status: 'active',
    category: 'Transport',
    createdAt: '2024-01-27T10:00:00Z',
    views: 38,
    interestedCount: 2,
    listingType: 'request',
    suggestedBarter: 'Domowe ciasto + 30 punktów',
    suggestedPoints: 70,
  },
];

// Helper functions for listings
export const getListingsByUser = (userId: string): Listing[] => {
  return listings.filter(l => l.ownerId === userId);
};

export const getOffers = (): Listing[] => {
  return listings.filter(l => l.listingType === 'offer' && l.status === 'active');
};

export const getRequests = (): Listing[] => {
  return listings.filter(l => l.listingType === 'request' && l.status === 'active');
};

export const getActiveListingsByUser = (userId: string): Listing[] => {
  return listings.filter(l => l.ownerId === userId && l.status === 'active');
};

export const getCompletedListingsByUser = (userId: string): Listing[] => {
  return listings.filter(l => l.ownerId === userId && l.status === 'completed');
};

export const getListingById = (id: string): Listing | undefined => {
  return listings.find(l => l.id === id);
};

// ── Listings CRUD operations ─────────────────────────────────────────────────

// Dodawanie nowego ogłoszenia
export const addListing = (listing: Omit<Listing, 'id' | 'createdAt' | 'views' | 'interestedCount'>): Listing => {
  const newListing: Listing = {
    ...listing,
    id: `lst-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    views: 0,
    interestedCount: 0,
  };
  
  // W rzeczywistej aplikacji byłby to API call
  // Na potrzeby demo, dodajemy do lokalnej tablicy
  listings.push(newListing);
  
  // Zapisujemy do localStorage dla trwałości
  const storedListings = localStorage.getItem('localLoop_listings');
  if (storedListings) {
    const parsed = JSON.parse(storedListings);
    parsed.push(newListing);
    localStorage.setItem('localLoop_listings', JSON.stringify(parsed));
  } else {
    localStorage.setItem('localLoop_listings', JSON.stringify(listings));
  }
  
  return newListing;
};

// Usuwanie ogłoszenia
export const deleteListing = (listingId: string): boolean => {
  const index = listings.findIndex(l => l.id === listingId);
  if (index === -1) return false;
  
  listings.splice(index, 1);
  
  // Aktualizujemy localStorage
  localStorage.setItem('localLoop_listings', JSON.stringify(listings));
  return true;
};

// Oznaczanie ogłoszenia jako zakończone
export const completeListing = (listingId: string, completedWithUserId: string): Listing | null => {
  const listing = listings.find(l => l.id === listingId);
  if (!listing) return null;
  
  listing.status = 'completed';
  listing.completedWithUserId = completedWithUserId;
  listing.completedAt = new Date().toISOString();
  const completedWithUser = users.find(u => u.id === completedWithUserId);
  listing.completedWith = completedWithUser?.name;
  
  // Aktualizujemy localStorage
  localStorage.setItem('localLoop_listings', JSON.stringify(listings));
  
  return listing;
};

// Aktualizacja ogłoszenia
export const updateListing = (listingId: string, updates: Partial<Listing>): Listing | null => {
  const listing = listings.find(l => l.id === listingId);
  if (!listing) return null;
  
  Object.assign(listing, updates);
  localStorage.setItem('localLoop_listings', JSON.stringify(listings));
  
  return listing;
};

// Inicjalizacja localStorage z początkowymi danymi
export const initializeListings = () => {
  const stored = localStorage.getItem('localLoop_listings');
  if (!stored) {
    localStorage.setItem('localLoop_listings', JSON.stringify(listings));
  } else {
    // Jeśli istnieją dane w localStorage, ładujemy je do pamięci
    const storedListings = JSON.parse(stored);
    listings.length = 0;
    listings.push(...storedListings);
  }
};

// Wywołaj inicjalizację
initializeListings();

// ── Activity Feed (generated from listings and interactions) ──────────────────

// Generate activity items dynamically from listings
export const getActivityFeed = (): ActivityItem[] => {
  // Get all listings, sort by createdAt descending, take first 5
  const recentListings = [...listings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const activities: ActivityItem[] = recentListings.map((listing, index) => ({
    id: `act-${listing.id}`,
    listingId: listing.id,
    userId: listing.ownerId,
    action: listing.listingType === 'offer' ? 'created_offer' : 'created_request',
    timestamp: listing.createdAt,
    likes: Math.floor(Math.random() * 15) + 1, // випадкові лайки для демо
  }));

  // Sort by timestamp descending (newest first)
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Helper to format time ago
export const timeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} sek. temu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min temu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. temu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} dni temu`;
  return date.toLocaleDateString('pl-PL');
};

// Get action text based on action type
export const getActionText = (action: ActivityItem['action'], listing: Listing, user: User): string => {
  switch (action) {
    case 'created_offer':
      return `udostępnia przedmiot: ${listing.title}`;
    case 'created_request':
      return `prosi o pomoc: ${listing.title}`;
    case 'completed_exchange':
      return `wymienił(a) się z sąsiadem`;
    default:
      return `interakcja z ogłoszeniem`;
  }
};

// ── Conversations & Messages ───────────────────────────────────────────────────

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    listingId: 'lst-1',
    lastMessage: 'Świetnie! Mogę odebrać wiertarkę w sobotę rano',
    lastMessageTime: '2024-01-28T10:30:00Z',
    unreadFor: ['user-1'],
  },
  {
    id: 'conv-2',
    participants: ['user-1', 'user-3'],
    listingId: 'req-2',
    lastMessage: 'Dziękuję za pomoc! Naprawdę doceniam',
    lastMessageTime: '2024-01-27T15:20:00Z',
    unreadFor: [],
  },
  {
    id: 'conv-3',
    participants: ['user-1', 'user-4'],
    listingId: 'lst-5',
    lastMessage: 'Drożdżówki są gotowe do odbioru 🥐',
    lastMessageTime: '2024-01-28T08:15:00Z',
    unreadFor: ['user-1'],
  },
  {
    id: 'conv-4',
    participants: ['user-1', 'user-5'],
    listingId: 'req-4',
    lastMessage: 'Czy mogę pożyczyć sekator w przyszłym tygodniu?',
    lastMessageTime: '2024-01-26T12:00:00Z',
    unreadFor: [],
  },
];

export const chatMessages: ChatMessage[] = [
  { id: 'msg-1', conversationId: 'conv-1', fromUserId: 'user-2', text: 'Cześć! Widzę, że oferujesz wiertarkę. Czy jest nadal dostępna?', timestamp: '2024-01-28T09:00:00Z', read: true },
  { id: 'msg-2', conversationId: 'conv-1', fromUserId: 'user-1', text: 'Tak, jest! Kiedy byś jej potrzebował/a?', timestamp: '2024-01-28T09:15:00Z', read: true },
  { id: 'msg-3', conversationId: 'conv-1', fromUserId: 'user-2', text: 'W sobotę planuję montaż półek. Czy mogłabym pożyczyć ją na weekend?', timestamp: '2024-01-28T09:30:00Z', read: true },
  { id: 'msg-4', conversationId: 'conv-1', fromUserId: 'user-1', text: 'Oczywiście! Mogę przynieść ją w sobotę rano.', timestamp: '2024-01-28T09:45:00Z', read: true },
  { id: 'msg-5', conversationId: 'conv-1', fromUserId: 'user-2', text: 'Świetnie! Mogę odebrać wiertarkę w sobotę rano', timestamp: '2024-01-28T10:30:00Z', read: false },
  
  { id: 'msg-6', conversationId: 'conv-3', fromUserId: 'user-4', text: 'Cześć! Upiekłam dzisiaj drożdżówki.', timestamp: '2024-01-28T08:00:00Z', read: true },
  { id: 'msg-7', conversationId: 'conv-3', fromUserId: 'user-1', text: 'Brzmi pysznie! Mogę wpaść?', timestamp: '2024-01-28T08:10:00Z', read: true },
  { id: 'msg-8', conversationId: 'conv-3', fromUserId: 'user-4', text: 'Drożdżówki są gotowe do odbioru 🥐', timestamp: '2024-01-28T08:15:00Z', read: false },
];

export const getMessagesForConversation = (conversationId: string): ChatMessage[] => {
  return chatMessages.filter(m => m.conversationId === conversationId);
};

export const getConversationWithUser = (conversationId: string, currentUserId: string): Conversation & { otherUser: User; listing: Listing } => {
  const conv = conversations.find(c => c.id === conversationId)!;
  const otherUserId = conv.participants.find(p => p !== currentUserId)!;
  const otherUser = getUserById(otherUserId)!;
  const listing = getListingById(conv.listingId)!;
  return { ...conv, otherUser, listing };
};

export const getUserConversations = (userId: string): Conversation[] => {
  return conversations.filter(c => c.participants.includes(userId));
};

// ── Categories ─────────────────────────────────────────────────────────────────

export const favorCategories: FavorCategory[] = [
  { id: 'cat-1', label: 'Naprawa', iconName: 'Wrench', gradientFrom: '#7dd3c0', gradientTo: '#a8d5ba' },
  { id: 'cat-2', label: 'Transport', iconName: 'Car', gradientFrom: '#89cff0', gradientTo: '#7dd3c0' },
  { id: 'cat-3', label: 'Edukacja', iconName: 'BookOpen', gradientFrom: '#a8d5ba', gradientTo: '#c2e7d9' },
  { id: 'cat-4', label: 'Dom i Ogród', iconName: 'Home', gradientFrom: '#7dd3c0', gradientTo: '#89cff0' },
  { id: 'cat-5', label: 'Opieka', iconName: 'Heart', gradientFrom: '#b8d8e8', gradientTo: '#89cff0' },
  { id: 'cat-6', label: 'Gotowanie', iconName: 'Utensils', gradientFrom: '#a8d5ba', gradientTo: '#7dd3c0' },
  { id: 'cat-7', label: 'Narzędzia', iconName: 'Wrench', gradientFrom: '#7dd3c0', gradientTo: '#a8d5ba' },
  { id: 'cat-8', label: 'Ogród', iconName: 'Home', gradientFrom: '#a8d5ba', gradientTo: '#c2e7d9' },
];

// ── Statistics ────────────────────────────────────────────────────────────────

export const communityStats: CommunityStats = {
  communityHealth: 87,
  totalExchanges: listings.filter(l => l.status === 'completed').length,
  impactScore: 12,
};

export const onboardingData = {
  tagline: 'Buduj lokalną społeczność, dziel się zasobami, redukuj ślad węglowy.',
  stats: [
    { label: 'Wymień', value: `${listings.filter(l => l.status === 'completed').length}+` },
    { label: 'Oszczędź', value: '85%' },
    { label: 'Połącz', value: `${users.length - 1}+` },
  ],
};

// Icebreakers for chat
export const icebreakerMessages: string[] = [
  'Hej, mogę w zamian przynieść domową kawę! ☕',
  'Cześć! Kiedy pasuje Ci odbiór?',
  'Chętnie pomogę w ogrodzie w zamian 🌱',
];