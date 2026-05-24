import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { currentUser, getUserById, getListingById } from '../../data/appData';
import { useConversations } from '../../contexts/ConversationsContext';
import type { Conversation } from '../../data/appData';

interface DesktopSmartChatProps {
  conversationId?: string;
  listingId?: string;
  ownerId?: string;
}

export default function DesktopSmartChat({ conversationId, listingId, ownerId }: DesktopSmartChatProps) {
  const { conversations, addConversation, addMessage, getMessagesForConversation } = useConversations();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Lokalny stan dla konwersacji
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Sprawdzenie czy to rozmowa z samym sobą
  const isSelfChat = ownerId === currentUser.id;

  useEffect(() => {
    if (isSelfChat) {
      setCurrentConversation(null);
      return;
    }

    if (conversationId) {
      const found = conversations.find(c => c.id === conversationId);
      if (found) {
        setCurrentConversation(found);
      } else {
        setCurrentConversation(null);
      }
    } else if (listingId && ownerId && !isSelfChat) {
      const found = conversations.find(
        c => c.listingId === listingId && c.participants.includes(ownerId)
      );
      if (found) {
        setCurrentConversation(found);
      } else {
        // Tworzymy nową rozmowę
        const newConv = addConversation(listingId, ownerId);
        setCurrentConversation(newConv);
      }
    } else {
      setCurrentConversation(null);
    }
  }, [conversationId, listingId, ownerId, conversations, addConversation, isSelfChat]);

  // Pobieranie danych zależnych od currentConversation
  const listing = currentConversation 
    ? getListingById(currentConversation.listingId) 
    : (listingId ? getListingById(listingId) : null);

  const otherUser = currentConversation
    ? getUserById(currentConversation.participants.find(p => p !== currentUser.id)!)
    : (ownerId && !isSelfChat ? getUserById(ownerId) : null);

  const messages = currentConversation ? getMessagesForConversation(currentConversation.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const icebreakers = [
    "Hej, mogę w zamian przynieść domową kawę! ☕",
    "Cześć! Kiedy pasuje Ci odbiór?",
    "Chętnie pomogę w ogrodzie w zamian 🌱",
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !currentConversation || isSelfChat) return;
    addMessage(currentConversation.id, text);
    setInputValue('');
  };

  if (!otherUser || !listing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-[#7dd3c0] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-[#f5f3ed] mb-2">Wybierz rozmowę</h3>
          <p className="text-sm text-[#b8b5ad]">Kliknij na konwersację z lewej, aby rozpocząć czat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)] p-6">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center shadow-lg`}>
            <span className="text-lg font-medium text-[#1e2026]">{otherUser.initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-lg text-[#f5f3ed]">{otherUser.name}</h2>
            <p className="text-sm text-[#b8b5ad]">{otherUser.neighborhood}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs text-[#b8b5ad]">Aktywny/a</p>
              <span className="text-xs text-[#b8b5ad]">•</span>
              <div className="text-xs text-[#7dd3c0] hover:underline">
                ogłoszenie: {listing.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-[#2a2d35] via-[#2a2d35] to-[#25292f]">
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
              <div className={`flex items-end gap-2 max-w-[70%] ${isFromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isFromMe && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-xs font-medium text-[#1e2026]">{otherUser.initials}</span>
                  </div>
                )}
                <div
                  className={`rounded-[1.25rem] px-5 py-3 shadow-lg ${
                    isFromMe
                      ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]'
                      : 'backdrop-blur-md bg-[rgba(245,243,237,0.95)] text-[#2a2d35] border border-[#7dd3c0]/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isFromMe ? 'text-[#1e2026]/60' : 'text-[#2a2d35]/50'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)]">
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
                className="flex-shrink-0 px-4 py-2.5 backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#89cff0]/10 border border-[#7dd3c0]/30 rounded-full text-sm text-[#f5f3ed] hover:bg-[#7dd3c0]/20 hover:border-[#7dd3c0]/50 hover:scale-105 hover:shadow-lg hover:shadow-[#7dd3c0]/20 transition-all duration-300"
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
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder={`Napisz do ${otherUser.name.split(' ')[0]}...`}
            className="flex-1 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="w-14 h-14 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 group"
          >
            <Send className="w-5 h-5 text-[#1e2026] group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}