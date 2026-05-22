import { useNavigate } from 'react-router-dom';
import { favorCategories, favorRequests } from '../../data/appData';
import { Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus, Filter } from 'lucide-react';

// Mapa nazw ikon do komponentów
const iconMap: Record<string, React.ElementType> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

export default function DesktopRequestFavor({ onOpenDetail }: DesktopRequestFavorProps) {
  const navigate = useNavigate();
  const categories = favorCategories;

  const recentRequests = favorRequests;

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Poproś o Przysługę</h1>
          <p className="text-sm text-[#b8b5ad]">Znajdź pomoc w sąsiedztwie</p>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search className="w-5 h-5 text-[#7dd3c0]" />
            </div>
            <input
              type="text"
              placeholder="Czego potrzebujesz?"
              className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/20 rounded-2xl text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
            />
          </div>
          <button className="px-6 py-3 backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 rounded-2xl flex items-center gap-2 text-sm text-[#f5f3ed] hover:border-[#7dd3c0]/40 hover:scale-105 transition-all duration-300">
            <Filter className="w-4 h-4 text-[#7dd3c0]" />
            Filtry
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="col-span-3">
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl mb-6">
              <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Popularne Kategorie</h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category, idx) => (
                  <button
                    key={idx}
                    className="relative overflow-hidden backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-xl p-4 hover:border-[#7dd3c0]/30 hover:scale-105 hover:shadow-lg hover:shadow-[#7dd3c0]/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0`}>
                        <category.iconName className="w-6 h-6 text-[#1e2026]" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-[#f5f3ed]">{category.label}</p>
                        <p className="text-xs text-[#b8b5ad]">{category.count} próśb</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[#f5f3ed]">Ostatnio Dodane</h3>
                <span className="text-xs text-[#b8b5ad]">{recentRequests.length} próśb</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentRequests.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenDetail(item)}
                    className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-xl p-4 hover:border-[#7dd3c0]/25 hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-sm font-medium text-[#1e2026]">{item.initials}</span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-[#f5f3ed] mb-1 truncate">{item.request}</p>
                        <p className="text-xs text-[#b8b5ad]">{item.user} • {item.time}</p>
                        <div className="mt-2">
                          <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <button
              onClick={() => navigate('/request-help')}
              className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(125,211,192,0.15)] to-[rgba(137,207,240,0.1)] border-2 border-dashed border-[#7dd3c0]/40 rounded-2xl p-6 hover:border-[#7dd3c0]/60 hover:scale-105 hover:shadow-xl hover:shadow-[#7dd3c0]/20 transition-all duration-300 group sticky top-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="w-8 h-8 text-[#1e2026]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f3ed] mb-1">Nie znalazłeś?</p>
                  <p className="text-xs text-[#7dd3c0]">Dodaj własną prośbę</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
