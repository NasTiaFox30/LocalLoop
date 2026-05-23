import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus } from 'lucide-react';
import { favorCategories, getRequests, getUserById, timeAgo } from '../../data/appData';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

export default function RequestHelp() {
  const navigate = useNavigate();
  const requests = getRequests();

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

        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-[#7dd3c0]" />
          </div>
          <input
            type="text"
            placeholder="Szukaj prośby (np. 'naprawa', 'transport')..."
            className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/20 rounded-[1.5rem] text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-xl focus:shadow-[#7dd3c0]/10 transition-all duration-300"
          />
        </div>

        {/* Kategorie próśb */}
        <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl mb-6">
          <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Popularne kategorie próśb</h3>
          <div className="grid grid-cols-2 gap-3">
            {favorCategories.map((category) => {
              const IconComponent = iconMap[category.iconName] ?? Wrench;
              const count = requests.filter(r => r.category === category.label).length;
              return (
                <button
                  key={category.id}
                  className="relative overflow-hidden backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl p-4 hover:border-[#7dd3c0]/30 hover:shadow-lg hover:shadow-[#7dd3c0]/10 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-start">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${category.gradientFrom}] to-[${category.gradientTo}] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-[#1e2026]" />
                    </div>
                    <span className="text-sm font-medium text-[#f5f3ed]">{category.label}</span>
                    <span className="text-xs text-[#b8b5ad] mt-0.5">{count} próśb</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ostatnio dodane prośby */}
        <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl mb-6">
          <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Ostatnio dodane prośby</h3>
          <div className="space-y-3">
            {requests.slice(0, 5).map((item) => {
              const owner = getUserById(item.ownerId);
              if (!owner) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate('/listing-detail', { state: { listingId: item.id } })}
                  className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl p-4 hover:border-[#7dd3c0]/25 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${owner.avatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <span className="text-sm font-medium text-[#1e2026]">{owner.initials}</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-[#f5f3ed] mb-1">{item.title}</p>
                      <p className="text-xs text-[#b8b5ad]">{owner.name} • {timeAgo(item.createdAt)}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0] group-hover:bg-[#7dd3c0]/30 transition-all duration-300 flex-shrink-0">
                      Zobacz
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Przycisk dodania własnej prośby */}
        <button
          onClick={() => navigate('/create-help-request')}
          className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(125,211,192,0.15)] to-[rgba(137,207,240,0.1)] border-2 border-dashed border-[#7dd3c0]/40 rounded-[1.5rem] p-6 hover:border-[#7dd3c0]/60 hover:shadow-xl hover:shadow-[#7dd3c0]/20 transition-all duration-300 group"
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
