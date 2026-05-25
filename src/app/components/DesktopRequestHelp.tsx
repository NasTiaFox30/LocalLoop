import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus, ArrowUpDown, X } from 'lucide-react';
import { favorCategories, getRequests, getUserById, timeAgo, type Listing, type User } from '../../data/firebaseData';

const iconMap: Record<string, React.ElementType> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

interface DesktopRequestHelpProps {
  onOpenDetail: (item: any) => void;
}

type SortOption = 'newest' | 'oldest';

export default function DesktopRequestHelp({ onOpenDetail }: DesktopRequestHelpProps) {
  const navigate = useNavigate();
  const categories = favorCategories;
  const [allRequests, setAllRequests] = useState<Listing[]>([]);
  const [ownersCache, setOwnersCache] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const requests = await getRequests();
        setAllRequests(requests);
        
        const ownerIds = [...new Set(requests.map(r => r.ownerId))];
        const owners = await Promise.all(ownerIds.map(id => getUserById(id)));
        const cache = new Map<string, User>();
        owners.forEach(owner => {
          if (owner) cache.set(owner.id, owner);
        });
        setOwnersCache(cache);
      } catch (error) {
        console.error('Failed to load requests:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = [...allRequests];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        req => req.title.toLowerCase().includes(query) ||
                req.description.toLowerCase().includes(query) ||
                req.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(req => req.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.()?.getTime() || new Date(a.createdAt as any).getTime();
      const dateB = b.createdAt?.toDate?.()?.getTime() || new Date(b.createdAt as any).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [allRequests, searchQuery, selectedCategory, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRequests.forEach(req => {
      counts[req.category] = (counts[req.category] || 0) + 1;
    });
    return counts;
  }, [allRequests]);

  const handleCategoryClick = (categoryLabel: string) => {
    setSelectedCategory(prev => prev === categoryLabel ? null : categoryLabel);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== null;

  const getOwner = (ownerId: string): User | null => {
    return ownersCache.get(ownerId) || null;
  };

  if (loading) {
    return (
      <div className="hidden lg:block min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Poproś o pomoc</h1>
          <p className="text-sm text-[#b8b5ad]">Zobacz, z czym potrzebują pomocy sąsiedzi</p>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search className="w-5 h-5 text-[#7dd3c0]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj prośby (np. 'naprawa', 'transport')..."
              className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/20 rounded-2xl text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b8b5ad] hover:text-[#7dd3c0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              className="px-6 py-3 backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 rounded-2xl flex items-center gap-2 text-sm text-[#f5f3ed] hover:border-[#7dd3c0]/40 hover:scale-105 transition-all duration-300"
            >
              <ArrowUpDown className="w-4 h-4 text-[#7dd3c0]" />
              {sortBy === 'newest' ? 'Najnowsze' : 'Najstarsze'}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 backdrop-blur-md bg-[rgba(232,141,141,0.1)] border border-[#e88d8d]/30 rounded-2xl flex items-center gap-2 text-sm text-[#e88d8d] hover:border-[#e88d8d]/50 hover:scale-105 transition-all duration-300"
              >
                <X className="w-4 h-4" />
                Wyczyść filtry
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#89cff0]/20 to-[#7dd3c0]/10 border border-[#89cff0]/30 text-sm text-[#89cff0] flex items-center gap-2">
                Szukaj: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-[#7dd3c0]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl mb-6">
              <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Popularne kategorie próśb</h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => {
                  const IconComponent = iconMap[category.iconName];
                  if (!IconComponent) return null;
                  const count = categoryCounts[category.label] || 0;
                  const isSelected = selectedCategory === category.label;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.label)}
                      className={`relative overflow-hidden backdrop-blur-sm rounded-xl p-4 transition-all duration-300 group ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#7dd3c0]/30 to-[#a8d5ba]/20 border-2 border-[#7dd3c0]/40 shadow-lg shadow-[#7dd3c0]/20'
                          : 'bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 hover:border-[#7dd3c0]/30 hover:scale-105 hover:shadow-lg hover:shadow-[#7dd3c0]/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${category.gradientFrom}] to-[${category.gradientTo}] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0`}>
                          <IconComponent className="w-6 h-6 text-[#1e2026]" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium text-[#f5f3ed]">{category.label}</p>
                          <p className="text-xs text-[#b8b5ad]">{count} próśb</p>
                        </div>
                        {isSelected && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#7dd3c0] rounded-full" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[#f5f3ed]">
                  {filteredAndSortedRequests.length === 0 
                    ? 'Brak próśb' 
                    : `Znaleziono ${filteredAndSortedRequests.length} próśb`}
                </h3>
                <span className="text-xs text-[#b8b5ad]">
                  {sortBy === 'newest' ? 'Najnowsze pierwsze' : 'Najstarsze pierwsze'}
                </span>
              </div>
              
              {filteredAndSortedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#b8b5ad]">Nie znaleziono próśb spełniających kryteria</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-xl"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredAndSortedRequests.map((item) => {
                    const owner = getOwner(item.ownerId);
                    if (!owner) return null;
                    const createdAt = item.createdAt?.toDate?.() || new Date(item.createdAt as any);
                    return (
                      <button
                        key={item.id}
                        onClick={() => onOpenDetail({ listingId: item.id })}
                        className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-xl p-4 hover:border-[#7dd3c0]/25 hover:scale-[1.02] transition-all duration-300 group text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${owner.avatarColor} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-sm font-medium text-[#1e2026]">{owner.initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#f5f3ed] mb-1 truncate">{item.title}</p>
                            <p className="text-xs text-[#b8b5ad]">{owner.name} • {timeAgo(createdAt)}</p>
                            <div className="mt-2">
                              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <button
              onClick={() => navigate('/create-help-request')}
              className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(125,211,192,0.15)] to-[rgba(137,207,240,0.1)] border-2 border-dashed border-[#7dd3c0]/40 rounded-2xl p-6 hover:border-[#7dd3c0]/60 hover:scale-105 hover:shadow-xl hover:shadow-[#7dd3c0]/20 transition-all duration-300 group sticky top-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="w-8 h-8 text-[#1e2026]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f3ed] mb-1">Nie widzisz odpowiedniej prośby?</p>
                  <p className="text-xs text-[#7dd3c0]">Dodaj własną prośbę o pomoc</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}