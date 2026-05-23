import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { conversations } from '../../data/appData';

export default function MessagesInbox() {
  const navigate = useNavigate();
  const unreadCount = conversations.filter(c => c.unread).length;

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
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => navigate('/messages/chat')}
              className={`w-full backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border ${
                conv.unread ? 'border-[#7dd3c0]/30' : 'border-[#7dd3c0]/10'
              } rounded-2xl p-4 hover:border-[#7dd3c0]/40 transition-all duration-300 flex items-start gap-3`}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${conv.avatarColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-sm font-medium text-[#1e2026]">{conv.initials}</span>
                </div>
                {conv.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] border-2 border-[#2a2d35] shadow-lg" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className={`font-medium ${conv.unread ? 'text-[#7dd3c0]' : 'text-[#f5f3ed]'}`}>
                    {conv.name}
                  </h3>
                  <span className="text-xs text-[#b8b5ad] flex-shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className={`text-sm ${conv.unread ? 'text-[#f5f3ed]' : 'text-[#b8b5ad]'} truncate`}>
                  {conv.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
