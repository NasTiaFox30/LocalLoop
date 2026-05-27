import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Leaf, Activity, Heart, MessageCircle, Mail, TrendingUp, Users, Sparkles } from 'lucide-react';
import { getCurrentUser, getCommunityStats, getActivityFeed, subscribeToActivityFeed, getUserById, type User, type CommunityStats, type ActivityItem } from '../../data/firebaseData';

interface DesktopDashboardProps {
  onOpenDetail: (item: ActivityItem) => void;
}

export default function DesktopDashboard({ onOpenDetail }: DesktopDashboardProps) {
  const navigate = useNavigate();
  const [currentUser] = useState<User | null>(getCurrentUser());
  const [communityStats, setCommunityStats] = useState<CommunityStats>({ communityHealth: 0, totalExchanges: 0, impactScore: 0 });
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAvatars, setUserAvatars] = useState<Map<string, string>>(new Map());

  // Funkcja do pobierania avatarów dla użytkowników w activity feed
  const loadUserAvatars = async (activities: ActivityItem[]) => {
    const newAvatars = new Map(userAvatars);
    let needsUpdate = false;
    
    for (const activity of activities) {
      if (!newAvatars.has(activity.userId) && activity.userId) {
        const user = await getUserById(activity.userId);
        if (user?.avatarUrl) {
          newAvatars.set(activity.userId, user.avatarUrl);
          needsUpdate = true;
        }
      }
    }
    
    if (needsUpdate) {
      setUserAvatars(newAvatars);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const stats = await getCommunityStats();
        setCommunityStats(stats);
        
        const feed = await getActivityFeed(10);
        setActivityFeed(feed);
        await loadUserAvatars(feed);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    const unsubscribe = subscribeToActivityFeed(async (activities) => {
      setActivityFeed(activities);
      await loadUserAvatars(activities);
    }, 10);
    
    return () => unsubscribe();
  }, []);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Witaj ponownie, {currentUser?.name?.split(' ')[0] || 'Gościu'}! 👋</h1>
              <p className="text-sm text-[#b8b5ad]">Odkryj, co nowego w Twojej społeczności</p>
            </div>
            {/* Avatar profilu - zaktualizowany */}
            <button
              onClick={() => navigate('/profile')}
              className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#89cff0]/20 to-[#7dd3c0]/20 border-2 border-[#7dd3c0]/30 flex items-center justify-center backdrop-blur-sm hover:border-[#7dd3c0]/50 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {currentUser?.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-lg font-medium text-[#7dd3c0]">${currentUser?.initials || '?'}</span>`;
                    }
                  }}
                />
              ) : (
                <span className="text-lg font-medium text-[#7dd3c0]">{currentUser?.initials || '?'}</span>
              )}
            </button>
          </div>
        </header>
        {/* Quick action cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate('/request-help')}
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
            onClick={() => navigate('/request-favor')}
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
              </div>
              <div>
                <h3 className="font-medium text-lg text-[#f5f3ed] mb-1">Wiadomości</h3>
                <p className="text-sm text-[#b8b5ad]">Sprawdź konwersacje</p>
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
              {activityFeed.length === 0 ? (
                <p className="text-center text-[#b8b5ad] py-8">Brak aktywności</p>
              ) : (
                activityFeed.map((item) => {
                  const avatarUrl = userAvatars.get(item.userId) || item.userAvatarUrl;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onOpenDetail(item)}
                      className="flex items-start gap-4 p-4 rounded-2xl backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 hover:border-[#7dd3c0]/30 hover:scale-[1.01] transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#7dd3c0]/10"
                    >
                      {/* Avatar - z obsługą zdjęcia */}
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt={item.userName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${item.userAvatarColor} flex items-center justify-center"><span class="text-base font-medium text-[#1e2026]">${item.userInitials}</span></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${item.userAvatarColor} flex items-center justify-center`}>
                            <span className="text-base font-medium text-[#1e2026]">{item.userInitials}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-[#f5f3ed]">
                          <span className="font-medium text-[#7dd3c0]">{item.userName}</span>{' '}
                          {item.action === 'created_offer' && `udostępnia: ${item.listingTitle}`}
                          {item.action === 'created_request' && `prosi o pomoc: ${item.listingTitle}`}
                          {item.action === 'completed_exchange' && 'zakończył/a udaną wymianę'}
                        </p>
                        <div className="flex gap-4 mt-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                            className={`flex items-center gap-2 text-sm transition-all duration-300 hover:scale-110 ${likedItems.includes(item.id) ? 'text-[#7dd3c0]' : 'text-[#b8b5ad] hover:text-[#7dd3c0]'}`}
                          >
                            <Heart className={`w-4 h-4 transition-all duration-300 ${likedItems.includes(item.id) ? 'fill-[#7dd3c0]' : ''}`} />
                            <span>{item.likes + (likedItems.includes(item.id) ? 1 : 0)}</span>
                          </button>
                          <button className="flex items-center gap-2 text-sm text-[#b8b5ad] hover:text-[#7dd3c0] hover:scale-110 transition-all duration-300">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
                  <div className="text-3xl font-medium bg-gradient-to-br from-[#a8d5ba] to-[#7dd3c0] bg-clip-text text-transparent">{currentUser?.exchangesCount || 0}</div>
                </div>
                <div className="backdrop-blur-sm bg-gradient-to-br from-[#89cff0]/10 to-transparent rounded-2xl border border-[#89cff0]/20 p-4 hover:border-[#89cff0]/40 hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#b8b5ad]">Impact Score</span>
                    <Users className="w-4 h-4 text-[#89cff0]" />
                  </div>
                  <div className="text-3xl font-medium bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] bg-clip-text text-transparent">{currentUser?.impactScore || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}