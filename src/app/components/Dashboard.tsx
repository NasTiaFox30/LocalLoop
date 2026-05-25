import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Leaf, Activity, Heart, MessageCircle, Mail } from 'lucide-react';
import { getCurrentUser, getCommunityStats, getActivityFeed, subscribeToActivityFeed, type User, type CommunityStats, type ActivityItem } from '../../data/firebaseData';

interface DashboardProps { onNavigate?: (s: string) => void; }

export default function Dashboard(_props: DashboardProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [communityStats, setCommunityStats] = useState<CommunityStats>({ communityHealth: 0, totalExchanges: 0, impactScore: 0 });
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const stats = await getCommunityStats();
        setCommunityStats(stats);
        
        const feed = await getActivityFeed(10);
        setActivityFeed(feed);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Subskrypcja na żywo aktywności
    const unsubscribe = subscribeToActivityFeed((activities) => {
      setActivityFeed(activities);
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
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-lg shadow-[#7dd3c0]/20">
                <Leaf className="w-6 h-6 text-[#1e2026]" />
              </div>
              <div>
                <h1 className="font-medium text-[#f5f3ed]">LocalLoop</h1>
                <p className="text-sm text-[#b8b5ad]">Twoja Społeczność</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/messages')}
                className="w-11 h-11 rounded-full backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300 relative"
              >
                <Mail className="w-5 h-5 text-[#7dd3c0]" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#89cff0]/20 to-[#7dd3c0]/20 border-2 border-[#7dd3c0]/30 flex items-center justify-center backdrop-blur-sm hover:border-[#7dd3c0]/50 transition-all duration-300"
              >
                <span className="text-sm font-medium text-[#7dd3c0]">{currentUser?.initials || '?'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/request-help')}
            className="relative overflow-hidden rounded-3xl p-5 h-40 backdrop-blur-md bg-gradient-to-br from-[#7dd3c0]/10 via-[#a8d5ba]/10 to-transparent border border-[#7dd3c0]/20 hover:border-[#7dd3c0]/40 transition-all duration-500 group shadow-lg shadow-[#7dd3c0]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3c0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-start h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center mb-auto group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-[#7dd3c0]/30">
                <Package className="w-7 h-7 text-[#1e2026]" />
              </div>
              <span className="font-medium text-sm text-[#f5f3ed]">Poproś o Przysługę</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/request-favor')}
            className="relative overflow-hidden rounded-3xl p-5 h-40 backdrop-blur-md bg-gradient-to-br from-[#89cff0]/10 via-[#7dd3c0]/10 to-transparent border border-[#89cff0]/20 hover:border-[#89cff0]/40 transition-all duration-500 group shadow-lg shadow-[#89cff0]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#89cff0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-start h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center mb-auto group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-[#89cff0]/30">
                <Leaf className="w-7 h-7 text-[#1e2026]" />
              </div>
              <span className="font-medium text-sm text-[#f5f3ed]">Pomóc innym</span>
            </div>
          </button>
        </div>

        {/* Activity feed */}
        <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-3xl border border-[#7dd3c0]/15 p-5 shadow-xl mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium text-[#f5f3ed]">Aktywność Sąsiadów</h2>
            <Activity className="w-5 h-5 text-[#7dd3c0]" />
          </div>
          <div className="space-y-3">
            {activityFeed.length === 0 ? (
              <p className="text-center text-[#b8b5ad] py-8">Brak aktywności</p>
            ) : (
              activityFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/listing-detail', { state: { listingId: item.listingId } })}
                  className="flex items-start gap-3 p-4 rounded-2xl backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 hover:border-[#7dd3c0]/25 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.userAvatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-sm font-medium text-[#1e2026]">{item.userInitials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f5f3ed]">
                      <span className="font-medium text-[#7dd3c0]">{item.userName}</span>{' '}
                      {item.action === 'created_offer' && `udostępnia: ${item.listingTitle}`}
                      {item.action === 'created_request' && `prosi o pomoc: ${item.listingTitle}`}
                      {item.action === 'completed_exchange' && 'zakończył/a udaną wymianę'}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                        className={`flex items-center gap-1 text-xs transition-all duration-300 ${likedItems.includes(item.id) ? 'text-[#7dd3c0]' : 'text-[#b8b5ad] hover:text-[#7dd3c0]'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${likedItems.includes(item.id) ? 'fill-[#7dd3c0]' : ''}`} />
                        <span>{item.likes + (likedItems.includes(item.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
                        className="flex items-center gap-1 text-xs text-[#b8b5ad] hover:text-[#7dd3c0] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Community stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="backdrop-blur-md bg-gradient-to-br from-[#7dd3c0]/10 to-transparent rounded-2xl border border-[#7dd3c0]/20 p-4 text-center shadow-lg">
            <div className="text-2xl font-medium bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] bg-clip-text text-transparent">{communityStats.communityHealth}%</div>
            <div className="text-xs text-[#b8b5ad] mt-1">Zdrowie Społeczności</div>
          </div>
          <div className="backdrop-blur-md bg-gradient-to-br from-[#a8d5ba]/10 to-transparent rounded-2xl border border-[#a8d5ba]/20 p-4 text-center shadow-lg">
            <div className="text-2xl font-medium bg-gradient-to-br from-[#a8d5ba] to-[#7dd3c0] bg-clip-text text-transparent">{currentUser?.exchangesCount || 0}</div>
            <div className="text-xs text-[#b8b5ad] mt-1">Twoje wymiany</div>
          </div>
          <div className="backdrop-blur-md bg-gradient-to-br from-[#89cff0]/10 to-transparent rounded-2xl border border-[#89cff0]/20 p-4 text-center shadow-lg">
            <div className="text-2xl font-medium bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] bg-clip-text text-transparent">{currentUser?.impactScore || 0}</div>
            <div className="text-xs text-[#b8b5ad] mt-1">Twój Impact Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}