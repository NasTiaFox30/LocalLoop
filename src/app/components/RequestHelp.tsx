import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus, ArrowUpDown, Clock, X } from 'lucide-react';
import { favorCategories, getRequests, getUserById, timeAgo } from '../../data/appData';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

type SortOption = 'newest' | 'oldest';

export default function RequestHelp() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showAllRequests, setShowAllRequests] = useState(false);
  
  const allRequests = getRequests();
  const INITIAL_DISPLAY_COUNT = 5;

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = [...allRequests];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query) ||
        request.category.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(request => request.category === selectedCategory);
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [allRequests, searchQuery, selectedCategory, sortBy]);

  const displayedRequests = showAllRequests ? filteredAndSortedRequests : filteredAndSortedRequests.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = filteredAndSortedRequests.length > INITIAL_DISPLAY_COUNT;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRequests.forEach(request => {
      counts[request.category] = (counts[request.category] || 0) + 1;
    });
    return counts;
  }, [allRequests]);

  const sortLabel = sortBy === 'newest' ? 'Najnowsze' : 'Najstarsze';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== null;

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
            <h1 className="font-medium text-[#f5f3ed]">Poproś o pomoc</h1>
            <p className="text-sm text-[#b8b5ad]">Zobacz, z czym potrzebują pomocy sąsiedzi</p>
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
            placeholder="Szukaj prośby (np. 'naprawa', 'transport')..."
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
            Znaleziono {filteredAndSortedRequests.length} próśb
          </p>
        </div>

        {/* Requests list */}
        <div className="space-y-3 mb-6">
          {displayedRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#b8b5ad]">Nie znaleziono próśb</p>
              <button onClick={clearFilters} className="mt-2 text-[#7dd3c0] text-sm">Wyczyść filtry</button>
            </div>
          ) : (
            displayedRequests.map((item) => {
              const owner = getUserById(item.ownerId);
              if (!owner) return null;
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
                      <p className="text-xs text-[#b8b5ad]">{owner.name} • {timeAgo(item.createdAt)}</p>
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
        {hasMore && !showAllRequests && (
          <button
            onClick={() => setShowAllRequests(true)}
            className="w-full py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#7dd3c0] text-sm mb-6"
          >
            Pokaż wszystkie ({filteredAndSortedRequests.length})
          </button>
        )}

        {showAllRequests && hasMore && (
          <button
            onClick={() => setShowAllRequests(false)}
            className="w-full py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#b8b5ad] text-sm mb-6"
          >
            Pokaż mniej
          </button>
        )}

        {/* Add button */}
        <button
          onClick={() => navigate('/create-help-request')}
          className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(125,211,192,0.15)] to-[rgba(137,207,240,0.1)] border-2 border-dashed border-[#7dd3c0]/40 rounded-[1.5rem] p-5 hover:border-[#7dd3c0]/60 hover:shadow-xl hover:shadow-[#7dd3c0]/20 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Plus className="w-6 h-6 text-[#1e2026]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#f5f3ed]">Nie widzisz odpowiedniej prośby?</p>
              <p className="text-xs text-[#7dd3c0]">Dodaj własną prośbę o pomoc</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}