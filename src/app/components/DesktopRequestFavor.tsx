import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { favorCategories, getOffers, getUserById, timeAgo } from '../../data/appData';
import { Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus, ArrowUpDown, X } from 'lucide-react';

// Mapa nazw ikon do komponentów
const iconMap: Record<string, React.ElementType> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

interface DesktopRequestFavorProps {
  onOpenDetail: (item: any) => void;
}

type SortOption = 'newest' | 'oldest';

export default function DesktopRequestFavor({ onOpenDetail }: DesktopRequestFavorProps) {
  const navigate = useNavigate();
  const categories = favorCategories;
  const allOffers = getOffers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filtrowanie i sortowanie ofert
  const filteredAndSortedOffers = useMemo(() => {
    let filtered = [...allOffers];

    // Filtrowanie po wyszukiwaniu
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        offer => offer.title.toLowerCase().includes(query) ||
                 offer.description.toLowerCase().includes(query) ||
                 offer.category.toLowerCase().includes(query)
      );
    }

    // Filtrowanie po kategorii
    if (selectedCategory) {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    // Sortowanie
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [allOffers, searchQuery, selectedCategory, sortBy]);

  // Statystyki kategorii
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allOffers.forEach(offer => {
      counts[offer.category] = (counts[offer.category] || 0) + 1;
    });
    return counts;
  }, [allOffers]);

  const handleCategoryClick = (categoryLabel: string) => {
    setSelectedCategory(prev => prev === categoryLabel ? null : categoryLabel);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== null;

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Udostępnij przedmiot lub usługę</h1>
          <p className="text-sm text-[#b8b5ad]">Znajdź to, czego potrzebujesz – sąsiedzi oferują pomoc</p>
        </header>

        {/* Search and sort bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search className="w-5 h-5 text-[#7dd3c0]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj przedmiotu lub usługi..."
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

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory && (
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-sm text-[#7dd3c0] flex items-center gap-2">
                Kategoria: {selectedCategory}
                <button onClick={() => setSelectedCategory(null)} className="hover:text-[#a8d5ba]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
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
            {/* Kategorie */}
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl mb-6">
              <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Popularne kategorie</h3>
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
                          <p className="text-xs text-[#b8b5ad]">{count} ofert</p>
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

            {/* Lista ofert */}
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[#f5f3ed]">
                  {filteredAndSortedOffers.length === 0 
                    ? 'Brak ofert' 
                    : `Znaleziono ${filteredAndSortedOffers.length} ofert`}
                </h3>
                <span className="text-xs text-[#b8b5ad]">
                  {sortBy === 'newest' ? 'Najnowsze pierwsze' : 'Najstarsze pierwsze'}
                </span>
              </div>
              
              {filteredAndSortedOffers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#b8b5ad]">Nie znaleziono ofert spełniających kryteria</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-xl"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredAndSortedOffers.map((item) => {
                    const owner = getUserById(item.ownerId);
                    if (!owner) return null;
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
                            <p className="text-xs text-[#b8b5ad]">{owner.name} • {timeAgo(item.createdAt)}</p>
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

          {/* Sidebar z przyciskiem do dodania własnej oferty */}
          <div className="col-span-1">
            <button
              onClick={() => navigate('/create-favor-request')}
              className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(125,211,192,0.15)] to-[rgba(137,207,240,0.1)] border-2 border-dashed border-[#7dd3c0]/40 rounded-2xl p-6 hover:border-[#7dd3c0]/60 hover:scale-105 hover:shadow-xl hover:shadow-[#7dd3c0]/20 transition-all duration-300 group sticky top-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="w-8 h-8 text-[#1e2026]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f3ed] mb-1">Nie znalazłeś?</p>
                  <p className="text-xs text-[#7dd3c0]">Dodaj własną ofertę</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
