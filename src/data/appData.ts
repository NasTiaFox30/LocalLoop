// ─────────────────────────────────────────────────────────────────────────────
// LocalLoop – centralny plik danych aplikacji
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

export interface ActivityItem {
  id: string;
  userId: string;
  user: string;
  initials: string;
  avatarColor: string;
  action: string;
  time: string;
  likes: number;
  category: string;
}

export interface Conversation {
  id: string;
  initials: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  time?: string;
}

export interface Listing {
  id: string;
  title: string;
  image: string;
  status: 'Aktywne' | 'Ukończone' | 'Oczekujące';
  views?: number;
  interested?: number;
  completedWith?: string;
  category?: string;
  description?: string;
  ownerId?: string;
}

export interface FavorCategory {
  id: string;
  label: string;
  iconName: string;
  gradientFrom: string;
  gradientTo: string;
  count: number;
}

export interface FavorRequest {
  id: string;
  userId: string;
  user: string;
  initials: string;
  avatarColor: string;
  request: string;
  time: string;
  category: string;
}

export interface Onboarding {
  stats: { label: string; value: string }[];
  tagline: string;
}

export interface CommunityStats {
  communityHealth: number;
  totalExchanges: number;
  impactScore: number;
}

export interface IcebreakerMessage {
  id: string;
  text: string;
}

// ── Dane użytkowników ─────────────────────────────────────────────────────────

export const currentUser: User = {
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
};

export const users: User[] = [
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

// ── Aktywność sąsiadów ────────────────────────────────────────────────────────

export const activityFeed: ActivityItem[] = [
  {
    id: 'act-1',
    userId: 'user-2',
    user: 'Anna Kowalska',
    initials: 'AK',
    avatarColor: 'from-[#7dd3c0] to-[#a8d5ba]',
    action: 'pożyczyła wiertarkę',
    time: '2 godz. temu',
    likes: 4,
    category: 'Narzędzia',
  },
  {
    id: 'act-2',
    userId: 'user-3',
    user: 'Piotr Nowak',
    initials: 'PN',
    avatarColor: 'from-[#89cff0] to-[#7dd3c0]',
    action: 'oferuje pomoc w przeprowadzce',
    time: '4 godz. temu',
    likes: 7,
    category: 'Transport',
  },
  {
    id: 'act-3',
    userId: 'user-4',
    user: 'Ewa Wiśniewska',
    initials: 'EW',
    avatarColor: 'from-[#a8d5ba] to-[#c2e7d9]',
    action: 'udostępniła drożdżówki',
    time: '6 godz. temu',
    likes: 12,
    category: 'Jedzenie',
  },
  {
    id: 'act-4',
    userId: 'user-5',
    user: 'Marek Zieliński',
    initials: 'MZ',
    avatarColor: 'from-[#b8d8e8] to-[#89cff0]',
    action: 'szuka narzędzi ogrodowych',
    time: '1 dzień temu',
    likes: 3,
    category: 'Dom i Ogród',
  },
  {
    id: 'act-5',
    userId: 'user-6',
    user: 'Kasia Nowak',
    initials: 'KN',
    avatarColor: 'from-[#7dd3c0] to-[#89cff0]',
    action: 'oferuje korepetycje z matematyki',
    time: '1 dzień temu',
    likes: 8,
    category: 'Edukacja',
  },
  {
    id: 'act-6',
    userId: 'user-7',
    user: 'Tomasz Kowalczyk',
    initials: 'TK',
    avatarColor: 'from-[#a8d5ba] to-[#7dd3c0]',
    action: 'wymienił rower na gitarę',
    time: '2 dni temu',
    likes: 15,
    category: 'Wymiana',
  },
];

// ── Wiadomości / Konwersacje ───────────────────────────────────────────────────

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    initials: 'AK',
    name: 'Anna Kowalska',
    lastMessage: 'Świetnie! Mogę odebrać wiertarkę w sobotę rano',
    time: '10 min',
    unread: true,
    avatarColor: 'from-[#7dd3c0] to-[#a8d5ba]',
  },
  {
    id: 'conv-2',
    initials: 'PN',
    name: 'Piotr Nowak',
    lastMessage: 'Dziękuję za pomoc! Naprawdę doceniam',
    time: '2 godz.',
    unread: false,
    avatarColor: 'from-[#89cff0] to-[#7dd3c0]',
  },
  {
    id: 'conv-3',
    initials: 'EW',
    name: 'Ewa Wiśniewska',
    lastMessage: 'Drożdżówki są gotowe do odbioru 🥐',
    time: '5 godz.',
    unread: true,
    avatarColor: 'from-[#a8d5ba] to-[#c2e7d9]',
  },
  {
    id: 'conv-4',
    initials: 'MZ',
    name: 'Marek Zieliński',
    lastMessage: 'Czy mogę pożyczyć sekator w przyszłym...',
    time: '1 dzień',
    unread: false,
    avatarColor: 'from-[#b8d8e8] to-[#89cff0]',
  },
  {
    id: 'conv-5',
    initials: 'KS',
    name: 'Kasia Szymańska',
    lastMessage: 'Super, dzięki za ciasto!',
    time: '2 dni',
    unread: false,
    avatarColor: 'from-[#7dd3c0] to-[#89cff0]',
  },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    { id: 'm1', from: 'them', text: 'Cześć! Widzę, że oferujesz wiertarkę. Czy jest nadal dostępna?' },
    { id: 'm2', from: 'me', text: 'Tak, jest! Kiedy byś jej potrzebował/a?' },
    { id: 'm3', from: 'them', text: 'W sobotę planuję montaż półek. Czy mogłabym pożyczyć ją na weekend?' },
    { id: 'm4', from: 'me', text: 'Oczywiście! Mogę przynieść ją w sobotę rano.' },
    { id: 'm5', from: 'them', text: 'Świetnie! Mogę odebrać wiertarkę w sobotę rano' },
  ],
  'conv-2': [
    { id: 'm1', from: 'me', text: 'Hej Piotrze, potrzebuję pomocy z przeprowadzką.' },
    { id: 'm2', from: 'them', text: 'Jasne, kiedy planujesz?' },
    { id: 'm3', from: 'me', text: 'W następną sobotę.' },
    { id: 'm4', from: 'them', text: 'Dziękuję za pomoc! Naprawdę doceniam' },
  ],
  'conv-3': [
    { id: 'm1', from: 'them', text: 'Cześć! Upiekłam dzisiaj drożdżówki.' },
    { id: 'm2', from: 'me', text: 'Brzmi pysznie! Mogę wpaść?' },
    { id: 'm3', from: 'them', text: 'Drożdżówki są gotowe do odbioru 🥐' },
  ],
};

export const icebreakerMessages: IcebreakerMessage[] = [
  { id: 'ice-1', text: 'Hej, mogę w zamian przynieść domową kawę! ☕' },
  { id: 'ice-2', text: 'Cześć! Kiedy pasuje Ci odbiór?' },
  { id: 'ice-3', text: 'Chętnie pomogę w ogrodzie w zamian 🌱' },
];

// ── Ogłoszenia ────────────────────────────────────────────────────────────────

export const myListings: Listing[] = [
  {
    id: 'lst-1',
    title: 'Wiertarka udarowa Bosch',
    image: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=400',
    status: 'Aktywne',
    views: 24,
    interested: 3,
    category: 'Narzędzia',
    description:
      'Wiertarka udarowa Bosch Professional w świetnym stanie, z baterią i ładowarką. Idealna do montażu mebli czy drobnych napraw.',
    ownerId: 'user-1',
  },
  {
    id: 'lst-2',
    title: 'Sekator ogrodowy',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    status: 'Aktywne',
    views: 12,
    interested: 1,
    category: 'Ogród',
    description: 'Sekator ogrodowy w dobrym stanie, idealny do przycinania krzewów i drzewek.',
    ownerId: 'user-1',
  },
];

export const pastListings: Listing[] = [
  {
    id: 'lst-3',
    title: 'Drabina aluminiowa',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    status: 'Ukończone',
    completedWith: 'Piotr N.',
    category: 'Narzędzia',
    ownerId: 'user-1',
  },
];

// ── Prośby o przysługi ────────────────────────────────────────────────────────

export const favorCategories: FavorCategory[] = [
  {
    id: 'cat-1',
    label: 'Naprawa',
    iconName: 'Wrench',
    gradientFrom: '#7dd3c0',
    gradientTo: '#a8d5ba',
    count: 12,
  },
  {
    id: 'cat-2',
    label: 'Transport',
    iconName: 'Car',
    gradientFrom: '#89cff0',
    gradientTo: '#7dd3c0',
    count: 8,
  },
  {
    id: 'cat-3',
    label: 'Edukacja',
    iconName: 'BookOpen',
    gradientFrom: '#a8d5ba',
    gradientTo: '#c2e7d9',
    count: 15,
  },
  {
    id: 'cat-4',
    label: 'Dom i Ogród',
    iconName: 'Home',
    gradientFrom: '#7dd3c0',
    gradientTo: '#89cff0',
    count: 20,
  },
  {
    id: 'cat-5',
    label: 'Opieka',
    iconName: 'Heart',
    gradientFrom: '#b8d8e8',
    gradientTo: '#89cff0',
    count: 6,
  },
  {
    id: 'cat-6',
    label: 'Gotowanie',
    iconName: 'Utensils',
    gradientFrom: '#a8d5ba',
    gradientTo: '#7dd3c0',
    count: 10,
  },
];

export const favorRequests: FavorRequest[] = [
  {
    id: 'req-1',
    userId: 'user-2',
    user: 'Anna K.',
    initials: 'AK',
    avatarColor: 'from-[#7dd3c0] to-[#a8d5ba]',
    request: 'Pomoc w przeprowadzce',
    time: '2h temu',
    category: 'Transport',
  },
  {
    id: 'req-2',
    userId: 'user-3',
    user: 'Piotr N.',
    initials: 'PN',
    avatarColor: 'from-[#89cff0] to-[#7dd3c0]',
    request: 'Naprawa roweru',
    time: '5h temu',
    category: 'Naprawa',
  },
  {
    id: 'req-3',
    userId: 'user-4',
    user: 'Ewa W.',
    initials: 'EW',
    avatarColor: 'from-[#a8d5ba] to-[#c2e7d9]',
    request: 'Korepetycje matematyka',
    time: '1d temu',
    category: 'Edukacja',
  },
  {
    id: 'req-4',
    userId: 'user-5',
    user: 'Marek Z.',
    initials: 'MZ',
    avatarColor: 'from-[#7dd3c0] to-[#89cff0]',
    request: 'Pożyczenie kosiarki',
    time: '1d temu',
    category: 'Dom i Ogród',
  },
  {
    id: 'req-5',
    userId: 'user-6',
    user: 'Kasia S.',
    initials: 'KS',
    avatarColor: 'from-[#b8d8e8] to-[#89cff0]',
    request: 'Transport mebli',
    time: '2d temu',
    category: 'Transport',
  },
  {
    id: 'req-6',
    userId: 'user-7',
    user: 'Tomasz K.',
    initials: 'TK',
    avatarColor: 'from-[#a8d5ba] to-[#7dd3c0]',
    request: 'Pomoc w malowaniu',
    time: '2d temu',
    category: 'Dom i Ogród',
  },
];

// ── Statystyki społeczności ───────────────────────────────────────────────────

export const communityStats: CommunityStats = {
  communityHealth: 87,
  totalExchanges: 142,
  impactScore: 12,
};

export const onboardingData = {
  tagline: 'Buduj lokalną społeczność, dziel się zasobami, redukuj ślad węglowy.',
  stats: [
    { label: 'Wymień', value: '2.4k+' },
    { label: 'Oszczędź', value: '85%' },
    { label: 'Połącz', value: '320+' },
  ],
};

// ── Nawigacja ─────────────────────────────────────────────────────────────────

export const navItems = [
  { label: 'Home', screen: 'dashboard', iconName: 'Home' },
  { label: 'Prośby', screen: 'request', iconName: 'Package' },
  { label: 'Udostępnij', screen: 'listing', iconName: 'Leaf' },
  { label: 'Wiadomości', screen: 'messages', iconName: 'Mail' },
  { label: 'Moje Ogłoszenia', screen: 'my-listings', iconName: 'Package' },
  { label: 'Profil', screen: 'profile', iconName: 'User' },
] as const;
