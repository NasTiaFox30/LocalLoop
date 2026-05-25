import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus, ArrowUpDown, X } from 'lucide-react';
import { favorCategories, getOffers, getUserById, timeAgo, type Listing, type User } from '../../data/firebaseData';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

type SortOption = 'newest' | 'oldest';

export default function RequestFavor() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [allOffers, setAllOffers] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownersCache, setOwnersCache] = useState<Map<string, User>>(new Map());

  const INITIAL_DISPLAY_COUNT = 5;

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      try {
        const offers = await getOffers();
        setAllOffers(offers);
        
        // Preload owner data
        const ownerIds = [...new Set(offers.map(o => o.ownerId))];
        const owners = await Promise.all(ownerIds.map(id => getUserById(id)));
        const cache = new Map<string, User>();
        owners.forEach(owner => {
          if (owner) cache.set(owner.id, owner);
        });
        setOwnersCache(cache);
      } catch (error) {
        console.error('Failed to load offers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  const filteredAndSortedOffers = useMemo(() => {
    let filtered = [...allOffers];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(query) ||
        offer.description.toLowerCase().includes(query) ||
        offer.category.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }
    
    filtered.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.()?.getTime() || new Date(a.createdAt as any).getTime();
      const dateB = b.createdAt?.toDate?.()?.getTime() || new Date(b.createdAt as any).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [allOffers, searchQuery, selectedCategory, sortBy]);

  const displayedOffers = showAllOffers ? filteredAndSortedOffers : filteredAndSortedOffers.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = filteredAndSortedOffers.length > INITIAL_DISPLAY_COUNT;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allOffers.forEach(offer => {
      counts[offer.category] = (counts[offer.category] || 0) + 1;
    });
    return counts;
  }, [allOffers]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== null;

  const getOwner = (ownerId: string): User | null => {
    return ownersCache.get(ownerId) || null;
  };

  // Konwersja Timestamp na string dla timeAgo
  const getFormattedTime = (timestamp: any): string => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return timeAgo(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-3 mb-6 pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div>
            <h1 className="font-medium text-[#f5f3ed]">Udostępnij przedmiot lub usługę</h1>
            <p className="text-sm text-[#b8b5ad]">Co oferują sąsiedzi</p>
          </div>
        </header>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-[#7dd3c0]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj przedmiotu lub usługi..."
            className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/20 rounded-[1.5rem] text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-xl focus:shadow-[#7dd3c0]/10 transition-all duration-300"
          />
        </div>

        {/* Sort row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            className="px-6 py-3 backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 rounded-2xl flex items-center gap-2 text-sm text-[#f5f3ed] hover:border-[#7dd3c0]/40 hover:scale-105 transition-all duration-300"
          >
            <ArrowUpDown className="w-4 h-4 text-[#7dd3c0]" />
            {sortBy === 'newest' ? 'Najnowsze' : 'Najstarsze'}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-[#7dd3c0] flex items-center gap-1">
              <X className="w-3 h-3" /> Wyczyść filtry
            </button>
          )}
        </div>

        {/* Categories - horizontal scroll */}
        <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {favorCategories.map((category) => {
              const IconComponent = iconMap[category.iconName] ?? Wrench;
              const count = categoryCounts[category.label] || 0;
              const isActive = selectedCategory === category.label;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isActive ? null : category.label)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border-[#7dd3c0]/40'
                      : 'bg-[rgba(40,43,50,0.4)] border-[#7dd3c0]/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-[${category.gradientFrom}] to-[${category.gradientTo}] flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-[#1e2026]" />
                  </div>
                  <span className={`text-xs ${isActive ? 'text-[#7dd3c0]' : 'text-[#f5f3ed]'}`}>
                    {category.label} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-3">
          <p className="text-xs text-[#b8b5ad]">
            Znaleziono {filteredAndSortedOffers.length} ofert
          </p>
        </div>

        {/* Offers list */}
        <div className="space-y-3 mb-6">
          {displayedOffers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#b8b5ad]">Nie znaleziono ofert</p>
              <button onClick={clearFilters} className="mt-2 text-[#7dd3c0] text-sm">Wyczyść filtry</button>
            </div>
          ) : (
            displayedOffers.map((item) => {
              const owner = getOwner(item.ownerId);
              if (!owner) return null;
              const createdAt = item.createdAt?.toDate?.() || new Date(item.createdAt as any);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate('/listing-detail', { state: { listingId: item.id } })}
                  className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl p-4 hover:border-[#7dd3c0]/25 transition-all duration-300 group text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${owner.avatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <span className="text-sm font-medium text-[#1e2026]">{owner.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#f5f3ed] mb-1">{item.title}</p>
                      <p className="text-xs text-[#b8b5ad]">{owner.name} • {timeAgo(createdAt)}</p>
                      <div className="mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Show more button */}
        {hasMore && !showAllOffers && (
          <button
            onClick={() => setShowAllOffers(true)}
            className="w-full py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#7dd3c0] text-sm mb-6"
          >
            Pokaż wszystkie ({filteredAndSortedOffers.length})
          </button>
        )}

        {showAllOffers && hasMore && (
          <button
            onClick={() => setShowAllOffers(false)}
            className="w-full py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#b8b5ad] text-sm mb-6"
          >
            Pokaż mniej
          </button>
        )}

        {/* Add button */}
        <button
          onClick={() => navigate('/create-favor-request')}
          className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(125,211,192,0.15)] to-[rgba(137,207,240,0.1)] border-2 border-dashed border-[#7dd3c0]/40 rounded-[1.5rem] p-5 hover:border-[#7dd3c0]/60 hover:shadow-xl hover:shadow-[#7dd3c0]/20 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Plus className="w-6 h-6 text-[#1e2026]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#f5f3ed]">Nie znalazłeś?</p>
              <p className="text-xs text-[#7dd3c0]">Dodaj własną ofertę</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}