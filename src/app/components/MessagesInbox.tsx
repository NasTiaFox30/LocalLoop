import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { currentUser, getUserById, getListingById, timeAgo } from '../../data/appData';
import { useConversations } from '../../contexts/ConversationsContext';

export default function MessagesInbox() {
  const navigate = useNavigate();
  const { getUserConversations, deleteConversation } = useConversations();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  
  const conversations = getUserConversations(currentUser.id);
  const unreadCount = conversations.filter(c => c.unreadFor.includes(currentUser.id)).length;

  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę rozmowę? Tej akcji nie można cofnąć.')) {
      deleteConversation(convId);
      setMenuOpenFor(null);
    }
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
          {conversations.map((conv) => {
            const otherUserId = conv.participants.find(p => p !== currentUser.id)!;
            const otherUser = getUserById(otherUserId)!;
            const listing = getListingById(conv.listingId)!;
            const isUnread = conv.unreadFor.includes(currentUser.id);

            return (
              <button
                key={conv.id}
                onClick={() => navigate('/messages/chat', { state: { conversationId: conv.id } })}
                className={`w-full backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border ${
                  isUnread ? 'border-[#7dd3c0]/30' : 'border-[#7dd3c0]/10'
                } rounded-2xl p-4 hover:border-[#7dd3c0]/40 transition-all duration-300 flex items-start gap-3`}
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <span className="text-sm font-medium text-[#1e2026]">{otherUser.initials}</span>
                  </div>
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] border-2 border-[#2a2d35] shadow-lg" />
                  )}
                </div>

                {/* Menu z trzema kropkami */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenFor(menuOpenFor === conv.id ? null : conv.id);
                    }}
                    className="absolute top-4 right-0 w-6 h-6 rounded-xl backdrop-blur-sm bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
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
          })}
        </div>
      </div>
    </div>
  );
}
