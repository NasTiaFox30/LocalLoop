import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { currentUser, getUserById, getListingById } from '../../data/appData';
import { useConversations } from '../../contexts/ConversationsContext';

export default function SmartChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addConversation, addMessage, getMessagesForConversation, conversations } = useConversations();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = location.state?.conversationId;
  const listingId = location.state?.listingId;
  const ownerId = location.state?.ownerId;

  // Zabezpieczenie: jeśli ownerId to aktualny użytkownik, przekieruj
  useEffect(() => {
    if (ownerId && ownerId === currentUser.id) {
      // Nie można czatować samemu ze sobą
      navigate('/messages', { replace: true });
    }
  }, [ownerId, navigate]);

  // Отримуємо розмову напряму з контексту на основі пропсів
  const conversation = conversationId 
    ? conversations.find(c => c.id === conversationId)
    : (listingId && ownerId 
        ? conversations.find(c => c.listingId === listingId && c.participants.includes(ownerId))
        : null);

  // Якщо listingId немає в state (перехід з інбоксу), беремо його з самої розмови
  const listing = listingId 
    ? getListingById(listingId) 
    : (conversation ? getListingById(conversation.listingId) : null);

  const otherUser = conversation
    ? getUserById(conversation.participants.find(p => p !== currentUser.id)!)
    : (ownerId ? getUserById(ownerId) : null);

  // Створюємо нову розмову лише тоді, коли її дійсно немає
  useEffect(() => {
    if (!conversation && listing && otherUser) {
      addConversation(listing.id, otherUser.id);
    }
  }, [conversation, listing, otherUser, addConversation]);

  const messages = conversation ? getMessagesForConversation(conversation.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const icebreakers = [
    "Hej, mogę w zamian przynieść domową kawę! ☕",
    "Cześć! Kiedy pasuje Ci odbiór?",
    "Chętnie pomogę w ogrodzie w zamian 🌱",
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !conversation) return;
    addMessage(conversation.id, text);
    setInputValue('');
  };

  if (!otherUser || !listing) {
    return (
      <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex items-center justify-center">
        <p>Nie znaleziono konwersacji</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <header className="flex items-center gap-3 p-4 border-b border-[#7dd3c0]/15 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.6)] to-[rgba(50,55,65,0.4)]">
          <button
            onClick={() => navigate('/messages')}
            className="w-11 h-11 rounded-2xl backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div className="flex-1">
            <h2 className="font-medium text-[#f5f3ed]">{otherUser.name}</h2>
            <p className="text-xs text-[#b8b5ad]">{otherUser.neighborhood}</p>
            <p className="text-xs text-[#7dd3c0] mt-0.5">Dot. {listing.title}</p>
          </div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center shadow-lg border-2 border-[#7dd3c0]/30`}>
            <span className="text-sm font-medium text-[#1e2026]">{otherUser.initials}</span>
          </div>
        </header>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-[#2a2d35] via-[#2a2d35] to-[#25292f]">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7dd3c0]/20 to-[#a8d5ba]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-[#7dd3c0]" />
              </div>
              <h3 className="text-lg font-medium text-[#f5f3ed] mb-2">
                Rozpocznij rozmowę z {otherUser.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-[#b8b5ad] max-w-md">
                Napisz wiadomość, aby omówić szczegóły dotyczące "{listing.title}"
              </p>
            </div>
          )}
          {messages.map((msg) => {
            const isFromMe = msg.fromUserId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-[1.25rem] px-5 py-3 shadow-lg ${
                  isFromMe
                    ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]'
                    : 'backdrop-blur-md bg-[rgba(245,243,237,0.95)] text-[#2a2d35] border border-[#7dd3c0]/10'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isFromMe ? 'text-[#1e2026]/60' : 'text-[#2a2d35]/50'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#7dd3c0]/15 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.6)] to-[rgba(50,55,65,0.4)]">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#1e2026]" />
              </div>
              <span className="text-xs text-[#b8b5ad] font-medium">AI Lodołamacze</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {icebreakers.map((ice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(ice)}
                  className="flex-shrink-0 px-4 py-2.5 backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#89cff0]/10 border border-[#7dd3c0]/30 rounded-full text-xs text-[#f5f3ed] hover:bg-[#7dd3c0]/20 hover:border-[#7dd3c0]/50 hover:shadow-lg hover:shadow-[#7dd3c0]/20 transition-all duration-300"
                >
                  {ice}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Napisz wiadomość..."
              className="flex-1 backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-3.5 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="w-14 h-14 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-lg shadow-[#7dd3c0]/20"
            >
              <Send className="w-5 h-5 text-[#1e2026]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
