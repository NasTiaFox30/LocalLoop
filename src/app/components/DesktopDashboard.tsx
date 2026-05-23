import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Leaf, Activity, Heart, MessageCircle, Mail, TrendingUp, Users, Sparkles } from 'lucide-react';
import { activityFeed, communityStats, currentUser } from '../../data/appData';
import type { ActivityItem } from '../../data/appData';

interface DesktopDashboardProps {
  onNavigate?: (s: string) => void;
  onOpenDetail: (item: ActivityItem) => void;
}

export default function DesktopDashboard({ onOpenDetail }: DesktopDashboardProps) {
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Witaj ponownie, {currentUser.name.split(' ')[0]}! 👋</h1>
              <p className="text-sm text-[#b8b5ad]">Odkryj, co nowego w Twojej społeczności</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#89cff0]/20 to-[#7dd3c0]/20 border-2 border-[#7dd3c0]/30 flex items-center justify-center backdrop-blur-sm hover:border-[#7dd3c0]/50 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="text-lg font-medium text-[#7dd3c0]">{currentUser.initials}</span>
            </button>
          </div>
        </header>

        {/* Quick action cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate('/request')}
            className="relative overflow-hidden rounded-3xl p-6 h-48 backdrop-blur-md bg-gradient-to-br from-[#89cff0]/10 via-[#7dd3c0]/10 to-transparent border border-[#89cff0]/20 hover:border-[#89cff0]/40 hover:scale-[1.02] transition-all duration-500 group shadow-xl shadow-[#89cff0]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3c0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center mb-auto group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-[#7dd3c0]/30">
                <Package className="w-7 h-7 text-[#1e2026]" />
              </div>
              <div>
                <h3 className="font-medium text-base text-[#f5f3ed] mb-1">Poproś o Przysługę</h3>
                <p className="text-xs text-[#b8b5ad]">Znajdź pomoc w okolicy</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/listing')}
            className="relative overflow-hidden rounded-3xl p-6 h-48 backdrop-blur-md bg-gradient-to-br from-[#89cff0]/10 via-[#7dd3c0]/10 to-transparent border border-[#89cff0]/20 hover:border-[#89cff0]/40 hover:scale-[1.02] transition-all duration-500 group shadow-xl shadow-[#89cff0]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#89cff0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center mb-auto group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-[#89cff0]/30">
                <Leaf className="w-8 h-8 text-[#1e2026]" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-[#f5f3ed] mb-1">Pomóc innym</h3>
                <p className="text-sm text-[#b8b5ad]">Podziel się zasobami</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/messages')}
            className="relative overflow-hidden rounded-3xl p-6 h-48 backdrop-blur-md bg-gradient-to-br from-[#a8d5ba]/10 via-[#c2e7d9]/10 to-transparent border border-[#a8d5ba]/20 hover:border-[#a8d5ba]/40 hover:scale-[1.02] transition-all duration-500 group shadow-xl shadow-[#a8d5ba]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#a8d5ba]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a8d5ba] to-[#c2e7d9] flex items-center justify-center mb-auto group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-[#a8d5ba]/30 relative">
                <Mail className="w-8 h-8 text-[#1e2026]" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] border-2 border-[#2a2d35] flex items-center justify-center shadow-lg">
                  <span className="text-xs font-medium text-[#1e2026]">2</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg text-[#f5f3ed] mb-1">Wiadomości</h3>
                <p className="text-sm text-[#b8b5ad]">2 nieprzeczytane</p>
              </div>
            </div>
          </button>
        </div>

        {/* Activity + Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#f5f3ed]">Aktywność Sąsiadów</h2>
              <Activity className="w-6 h-6 text-[#7dd3c0]" />
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenDetail(item)}
                  className="flex items-start gap-4 p-4 rounded-2xl backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 hover:border-[#7dd3c0]/30 hover:scale-[1.01] transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#7dd3c0]/10"
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-base font-medium text-[#1e2026]">{item.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-[#f5f3ed]">
                      <span className="font-medium text-[#7dd3c0]">{item.user}</span> {item.action}
                    </p>
                    <p className="text-sm text-[#b8b5ad] mt-1">{item.time}</p>
                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                        className={`flex items-center gap-2 text-sm transition-all duration-300 hover:scale-110 ${likedItems.includes(item.id) ? 'text-[#7dd3c0]' : 'text-[#b8b5ad] hover:text-[#7dd3c0]'}`}
                      >
                        <Heart className={`w-4 h-4 transition-all duration-300 ${likedItems.includes(item.id) ? 'fill-[#7dd3c0]' : ''}`} />
                        <span>{item.likes + (likedItems.includes(item.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
                        className="flex items-center gap-2 text-sm text-[#b8b5ad] hover:text-[#7dd3c0] hover:scale-110 transition-all duration-300"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Odpowiedz</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="col-span-1 space-y-6">
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#7dd3c0]" />
                <h3 className="font-medium text-[#f5f3ed]">Twoje Statystyki</h3>
              </div>
              <div className="space-y-4">
                <div className="backdrop-blur-sm bg-gradient-to-br from-[#7dd3c0]/10 to-transparent rounded-2xl border border-[#7dd3c0]/20 p-4 hover:border-[#7dd3c0]/40 hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#b8b5ad]">Zdrowie Społeczności</span>
                    <TrendingUp className="w-4 h-4 text-[#7dd3c0]" />
                  </div>
                  <div className="text-3xl font-medium bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] bg-clip-text text-transparent">{communityStats.communityHealth}%</div>
                </div>
                <div className="backdrop-blur-sm bg-gradient-to-br from-[#a8d5ba]/10 to-transparent rounded-2xl border border-[#a8d5ba]/20 p-4 hover:border-[#a8d5ba]/40 hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#b8b5ad]">Wymian</span>
                    <Package className="w-4 h-4 text-[#a8d5ba]" />
                  </div>
                  <div className="text-3xl font-medium bg-gradient-to-br from-[#a8d5ba] to-[#7dd3c0] bg-clip-text text-transparent">{communityStats.totalExchanges}</div>
                </div>
                <div className="backdrop-blur-sm bg-gradient-to-br from-[#89cff0]/10 to-transparent rounded-2xl border border-[#89cff0]/20 p-4 hover:border-[#89cff0]/40 hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#b8b5ad]">Impact Score</span>
                    <Users className="w-4 h-4 text-[#89cff0]" />
                  </div>
                  <div className="text-3xl font-medium bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] bg-clip-text text-transparent">+{communityStats.impactScore}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
