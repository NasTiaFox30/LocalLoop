import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';
import { getCurrentUser, getUserById, timeAgo } from '../../data/firebaseData';
import { useConversations } from '../../contexts/ConversationsContext';
import DesktopSmartChat from './DesktopSmartChat';

export default function DesktopMessages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserConversations, deleteConversation, addConversation, conversations, loading: convLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [usersCache, setUsersCache] = useState<Map<string, any>>(new Map());
  
  const userConversations = useMemo(() => {
    if (!currentUser) return [];
    return getUserConversations(currentUser.id);
  }, [currentUser, getUserConversations, conversations]);

  // Załaduj dane dla wszystkich konwersacji
  useEffect(() => {
    const loadUsersData = async () => {
      if (userConversations.length === 0) return;
      
      const newUsersCache = new Map(usersCache);
      let needsUpdate = false;
      
      for (const conv of userConversations) {
        const otherUserId = conv.participants.find(p => p !== currentUser?.id);
        if (otherUserId && !newUsersCache.has(otherUserId)) {
          const user = await getUserById(otherUserId);
          if (user) {
            newUsersCache.set(otherUserId, user);
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        setUsersCache(newUsersCache);
      }
    };
    
    loadUsersData();
  }, [userConversations, currentUser?.id]);

  // Obsługa nowej konwersacji z DetailDrawer
  useEffect(() => {
    const listId = location.state?.listingId;
    const ownId = location.state?.ownerId;
    
    if (isCreatingConversation || !listId || !ownId || !currentUser || currentUser.id === ownId) {
      return;
    }
    
    const initNewConversation = async () => {
      setIsCreatingConversation(true);
      
      try {
        const existingConv = userConversations.find(c => 
          c.listingId === listId && 
          c.participants.includes(ownId) &&
          c.participants.includes(currentUser.id)
        );
        
        if (existingConv) {
          setSelectedConversationId(existingConv.id);
        } else {
          const newConv = await addConversation(listId, ownId);
          if (newConv) {
            setSelectedConversationId(newConv.id);
          }
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
      } finally {
        setIsCreatingConversation(false);
        navigate('/messages', { replace: true, state: {} });
      }
    };
    
    initNewConversation();
  }, [location.state, currentUser, userConversations, addConversation, navigate, isCreatingConversation]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleSelectConversation = useCallback((convId: string) => {
    setSelectedConversationId(convId);
    setMenuOpenFor(null);
  }, []);

  const handleDeleteConversation = useCallback(async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę rozmowę? Tej akcji nie można cofnąć.')) {
      await deleteConversation(convId);
      if (selectedConversationId === convId) {
        setSelectedConversationId(null);
      }
      setMenuOpenFor(null);
    }
  }, [deleteConversation, selectedConversationId]);

  // Helper do pobierania danych z cache
  const getOtherUser = (conv: any) => {
    const otherUserId = conv.participants.find((p: string) => p !== currentUser?.id);
    return otherUserId ? usersCache.get(otherUserId) : null;
  };

  if (loading || convLoading || !currentUser) {
    return (
      <div className="hidden lg:block min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-96 border-r border-[#7dd3c0]/15 backdrop-blur-md flex flex-col">
          <div className="p-6 border-b border-[#7dd3c0]/15">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="lg:hidden w-10 h-10 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
              </button>
              <div>
                <h1 className="text-2xl font-medium text-[#f5f3ed]">Wiadomości</h1>
                <p className="text-sm text-[#b8b5ad]">
                  {userConversations.filter(c => c.unreadFor.includes(currentUser.id)).length} nieprzeczytane
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Search className="w-5 h-5 text-[#7dd3c0]" />
              </div>
              <input
                type="text"
                placeholder="Szukaj rozmów..."
                className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {userConversations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#b8b5ad]">Brak konwersacji</p>
                <p className="text-xs text-[#b8b5ad] mt-2">
                  Rozpocznij rozmowę z sąsiadem, aby pojawiły się tutaj wiadomości
                </p>
              </div>
            ) : (
              userConversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                
                // Jeśli dane się jeszcze ładują, pokaż placeholder
                if (!otherUser) {
                  return (
                    <div key={conv.id} className="animate-pulse">
                      <div className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.3)] border border-[#7dd3c0]/10 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-600" />
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
                const isSelected = selectedConversationId === conv.id;
                const lastMessageTime = conv.lastMessageTime?.toDate?.() || new Date(conv.lastMessageTime as any);

                return (
                  <div key={conv.id} className="relative group">
                    <button
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full backdrop-blur-md border rounded-2xl p-4 transition-all duration-300 flex items-start gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[rgba(125,211,192,0.2)] to-[rgba(168,213,186,0.1)] border-[#7dd3c0]/30 shadow-lg'
                          : 'bg-[rgba(40,43,50,0.4)] border-[#7dd3c0]/10 hover:border-[#7dd3c0]/25 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-md flex-shrink-0">
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
                          <h3 className={`font-medium text-sm truncate ${isUnread ? 'text-[#7dd3c0]' : 'text-[#f5f3ed]'}`}>
                            {otherUser.name}
                          </h3>
                          <span className="text-xs text-[#b8b5ad] flex-shrink-0 ml-2">
                            {timeAgo(lastMessageTime)}
                          </span>
                        </div>
                        <p className={`text-sm ${isUnread ? 'text-[#f5f3ed]' : 'text-[#b8b5ad]'} truncate`}>
                          {conv.lastMessage || 'Nowa rozmowa'}
                        </p>
                      </div>
                    </button>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenFor(menuOpenFor === conv.id ? null : conv.id);
                        }}
                        className="w-8 h-8 rounded-xl backdrop-blur-sm bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-[#7dd3c0]" />
                      </button>
                    </div>
                    
                    {menuOpenFor === conv.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 backdrop-blur-xl bg-[rgba(42,45,53,0.95)] border border-[#7dd3c0]/20 rounded-xl shadow-2xl overflow-hidden">
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

        {/* Chat Area */}
        <DesktopSmartChat
          conversationId={selectedConversationId || undefined}
        />
      </div>
    </div>
  );
}