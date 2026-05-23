import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';
import { currentUser, getUserById, timeAgo } from '../../data/appData';
import { useConversations } from '../../contexts/ConversationsContext';
import DesktopSmartChat from './DesktopSmartChat';

export default function DesktopMessages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserConversations, deleteConversation } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [tempChatParams, setTempChatParams] = useState<{ listingId: string; ownerId: string } | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const userConversations = getUserConversations(currentUser.id);

  useEffect(() => {
    const convId = location.state?.conversationId;
    const listId = location.state?.listingId;
    const ownId = location.state?.ownerId;

    if (convId) {
      setSelectedConversationId(convId);
      setTempChatParams(null);
    } else if (listId && ownId) {
      const existingConv = userConversations.find(c => {
        const otherId = c.participants.find(p => p !== currentUser.id);
        return c.listingId === listId && otherId === ownId;
      });
      if (existingConv) {
        setSelectedConversationId(existingConv.id);
        setTempChatParams(null);
      } else {
        setSelectedConversationId(null);
        setTempChatParams({ listingId: listId, ownerId: ownId });
      }
    }
    // nie resetuj stanu gdy location.state jest pusty!
  }, [location.state, userConversations]);

  const handleSelectConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setTempChatParams(null);
    setMenuOpenFor(null);
    navigate('/messages', { replace: true, state: {} });
  };

  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę rozmowę? Tej akcji nie można cofnąć.')) {
      deleteConversation(convId);
      if (selectedConversationId === convId) {
        setSelectedConversationId(null);
      }
      setMenuOpenFor(null);
    }
  };

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-96 border-r border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)] flex flex-col">
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
            {userConversations.map((conv) => {
              const otherUserId = conv.participants.find(p => p !== currentUser.id)!;
              const otherUser = getUserById(otherUserId);
              if (!otherUser) return null;
              const isUnread = conv.unreadFor.includes(currentUser.id);
              const isSelected = selectedConversationId === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full backdrop-blur-md border rounded-2xl p-4 transition-all duration-300 flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[rgba(125,211,192,0.2)] to-[rgba(168,213,186,0.1)] border-[#7dd3c0]/30 shadow-lg'
                      : 'bg-[rgba(60,65,75,0.3)] border-[#7dd3c0]/10 hover:border-[#7dd3c0]/25 hover:scale-[1.02]'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <span className="text-sm font-medium text-[#1e2026]">{otherUser.initials}</span>
                    </div>
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] border-2 border-[#2a2d35] shadow-lg" />
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-medium text-sm ${isUnread ? 'text-[#7dd3c0]' : 'text-[#f5f3ed]'}`}>
                        {otherUser.name}
                      </h3>
                      <span className="text-xs text-[#b8b5ad] flex-shrink-0 ml-2">
                        {timeAgo(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className={`text-sm ${isUnread ? 'text-[#f5f3ed]' : 'text-[#b8b5ad]'} truncate`}>
                      {conv.lastMessage || 'Nowa rozmowa'}
                    </p>
                  </div>
                </button>
              );
            })}

            {userConversations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#b8b5ad]">Brak konwersacji</p>
                <p className="text-xs text-[#b8b5ad] mt-2">
                  Rozpocznij rozmowę z sąsiadem, aby pojawiły się tutaj wiadomości
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <DesktopSmartChat
          conversationId={selectedConversationId || undefined}
          listingId={tempChatParams?.listingId}
          ownerId={tempChatParams?.ownerId}
        />
      </div>
    </div>
  );
}
