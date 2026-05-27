import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getUserById, getListingById, timeAgo } from '../../data/firebaseData';
import { useConversations } from '../../contexts/ConversationsContext';

export default function MessagesInbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserConversations, deleteConversation, addConversation } = useConversations();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [usersCache, setUsersCache] = useState<Map<string, any>>(new Map());
  const [listingsCache, setListingsCache] = useState<Map<string, any>>(new Map());
  
  const conversationsList = currentUser ? getUserConversations(currentUser.id) : [];
  const unreadCount = conversationsList.filter(c => c.unreadFor.includes(currentUser?.id || '')).length;

  // Załaduj dane dla wszystkich konwersacji
  useEffect(() => {
    const loadConversationsData = async () => {
      if (conversationsList.length === 0) return;
      
      const newUsersCache = new Map(usersCache);
      const newListingsCache = new Map(listingsCache);
      let needsUpdate = false;
      
      for (const conv of conversationsList) {
        // Załaduj drugiego użytkownika
        const otherUserId = conv.participants.find(p => p !== currentUser?.id);
        if (otherUserId && !newUsersCache.has(otherUserId)) {
          const user = await getUserById(otherUserId);
          if (user) {
            newUsersCache.set(otherUserId, user);
            needsUpdate = true;
          }
        }
        
        // Załaduj ogłoszenie
        if (!newListingsCache.has(conv.listingId)) {
          const listing = await getListingById(conv.listingId);
          if (listing) {
            newListingsCache.set(conv.listingId, listing);
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        setUsersCache(newUsersCache);
        setListingsCache(newListingsCache);
      }
    };
    
    loadConversationsData();
  }, [conversationsList, currentUser?.id]);

  // Obsługa nowej konwersacji z DetailDrawer
  useEffect(() => {
    const listId = location.state?.listingId;
    const ownId = location.state?.ownerId;
    
    if (isCreatingConversation) return;
    
    const initNewConversation = async () => {
      if (listId && ownId && currentUser && currentUser.id !== ownId) {
        setIsCreatingConversation(true);
        
        try {
          const existingConv = conversationsList.find(c => {
            const otherId = c.participants.find(p => p !== currentUser.id);
            return c.listingId === listId && otherId === ownId;
          });
          
          if (existingConv) {
            navigate('/messages/chat', { state: { conversationId: existingConv.id }, replace: true });
          } else {
            const newConv = await addConversation(listId, ownId);
            navigate('/messages/chat', { state: { conversationId: newConv?.id }, replace: true });
          }
        } catch (error) {
          console.error('Failed to create conversation:', error);
        } finally {
          setIsCreatingConversation(false);
          navigate('/messages', { replace: true, state: {} });
        }
      }
    };
    
    initNewConversation();
  }, [location.state, currentUser, conversationsList, addConversation, navigate, isCreatingConversation]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleDeleteConversation = useCallback(async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę rozmowę? Tej akcji nie można cofnąć.')) {
      await deleteConversation(convId);
      setMenuOpenFor(null);
    }
  }, [deleteConversation]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Helper do pobierania danych z cache
  const getOtherUser = (conv: any) => {
    const otherUserId = conv.participants.find((p: string) => p !== currentUser?.id);
    return otherUserId ? usersCache.get(otherUserId) : null;
  };
  
  const getListing = (conv: any) => {
    return listingsCache.get(conv.listingId);
  };

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
            <h1 className="font-medium text-[#f5f3ed]">Wiadomości</h1>
            <p className="text-sm text-[#b8b5ad]">{unreadCount} nieprzeczytane</p>
          </div>
        </header>

        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-[#7dd3c0]" />
          </div>
          <input
            type="text"
            placeholder="Szukaj rozmów..."
            className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/20 rounded-[1.5rem] text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-xl focus:shadow-[#7dd3c0]/10 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          {conversationsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#b8b5ad]">Brak konwersacji</p>
              <p className="text-xs text-[#b8b5ad] mt-2">
                Rozpocznij rozmowę z sąsiadem, aby pojawiły się tutaj wiadomości
              </p>
            </div>
          ) : (
            conversationsList.map((conv) => {
              const otherUser = getOtherUser(conv);
              const listing = getListing(conv);
              
              // Jeśli dane się jeszcze ładują, pokaż placeholder
              if (!otherUser || !listing) {
                return (
                  <div key={conv.id} className="animate-pulse">
                    <div className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-full bg-gray-600" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-600 rounded w-32 mb-2" />
                          <div className="h-3 bg-gray-600 rounded w-48" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              const isUnread = conv.unreadFor.includes(currentUser.id);
              const lastMessageTime = conv.lastMessageTime?.toDate?.() || new Date(conv.lastMessageTime as any);

              return (
                <div key={conv.id} className="relative group">
                  <button
                    onClick={() => navigate('/messages/chat', { state: { conversationId: conv.id } })}
                    className={`w-full backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border ${
                      isUnread ? 'border-[#7dd3c0]/30' : 'border-[#7dd3c0]/10'
                    } rounded-2xl p-4 hover:border-[#7dd3c0]/40 transition-all duration-300 flex items-start gap-3`}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden shadow-md flex-shrink-0">
                        {otherUser.avatarUrl ? (
                          <img 
                            src={otherUser.avatarUrl} 
                            alt={otherUser.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center"><span class="text-sm font-medium text-[#1e2026]">${otherUser.initials}</span></div>`;
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center`}>
                            <span className="text-sm font-medium text-[#1e2026]">{otherUser.initials}</span>
                          </div>
                        )}
                      </div>
                      {isUnread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] border-2 border-[#2a2d35] shadow-lg" />
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-medium truncate ${isUnread ? 'text-[#7dd3c0]' : 'text-[#f5f3ed]'}`}>
                          {otherUser.name}
                        </h3>
                        <span className="text-xs text-[#b8b5ad] flex-shrink-0 ml-2">{timeAgo(lastMessageTime)}</span>
                      </div>
                      <p className={`text-sm ${isUnread ? 'text-[#f5f3ed]' : 'text-[#b8b5ad]'} truncate`}>
                        {conv.lastMessage || 'Nowa rozmowa'}
                      </p>
                      <p className="text-xs text-[#b8b5ad] mt-1 truncate">
                        Dot. {listing.title}
                      </p>
                    </div>
                  </button>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenFor(menuOpenFor === conv.id ? null : conv.id);
                      }}
                      className="w-8 h-8 rounded-xl backdrop-blur-sm bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
                    >
                      <MoreVertical className="w-5 h-5 text-[#7dd3c0]" />
                    </button>
                  </div>
                  
                  {menuOpenFor === conv.id && (
                    <div className="absolute right-0 top-12 z-20 w-40 backdrop-blur-xl bg-[rgba(42,45,53,0.95)] border border-[#7dd3c0]/20 rounded-xl shadow-2xl overflow-hidden">
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="w-full px-4 py-3 text-sm text-[#e88d8d] hover:bg-[rgba(232,141,141,0.1)] flex items-center gap-2 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Usuń chat
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}