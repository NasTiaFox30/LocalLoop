import { useNavigate } from 'react-router-dom';
import { conversations, chatMessages, icebreakerMessages } from '../../data/appData';
import { useState } from 'react';
import { Search, Send, Sparkles } from 'lucide-react';

interface DesktopMessagesProps {
}

export default function DesktopMessages({}: DesktopMessagesProps) {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const allConversations = conversations;

  const chatMessages = [
    { from: 'them', text: 'Cześć! Widzę, że oferujesz wiertarkę. Czy jest nadal dostępna?' },
    { from: 'me', text: 'Tak, jest! Kiedy byś jej potrzebował/a?' },
    { from: 'them', text: 'W sobotę planuję montaż półek. Czy mogłabym pożyczyć ją na weekend?' },
    { from: 'me', text: 'Oczywiście! Mogę przynieść ją w sobotę rano.' },
    { from: 'them', text: 'Świetnie! Mogę odebrać wiertarkę w sobotę rano' },
  ];

  const icebreakers = [
    'Hej, mogę w zamian przynieść domową kawę! ☕',
    'Cześć! Kiedy pasuje Ci odbiór?',
    'Chętnie pomogę w ogrodzie w zamian 🌱',
  ];

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      setInputValue('');
    }
  };

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="h-screen flex">
        <div className="w-96 border-r border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)] flex flex-col">
          <div className="p-6 border-b border-[#7dd3c0]/15">
            <h1 className="text-2xl font-medium text-[#f5f3ed] mb-4">Wiadomości</h1>
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
            {allConversations.map((conv, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedChat(idx)}
                className={`w-full backdrop-blur-md border rounded-2xl p-4 transition-all duration-300 flex items-start gap-3 ${
                  selectedChat === idx
                    ? 'bg-gradient-to-r from-[rgba(125,211,192,0.2)] to-[rgba(168,213,186,0.1)] border-[#7dd3c0]/30 shadow-lg'
                    : 'bg-[rgba(60,65,75,0.3)] border-[#7dd3c0]/10 hover:border-[#7dd3c0]/25 hover:scale-[1.02]'
                }`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <span className="text-sm font-medium text-[#1e2026]">{conv.initials}</span>
                  </div>
                  {conv.unread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] border-2 border-[#2a2d35] shadow-lg" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-medium text-sm ${conv.unread ? 'text-[#7dd3c0]' : 'text-[#f5f3ed]'}`}>{conv.name}</h3>
                    <span className="text-xs text-[#b8b5ad] flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className={`text-sm ${conv.unread ? 'text-[#f5f3ed]' : 'text-[#b8b5ad]'} truncate`}>{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)] p-6">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${conversations[selectedChat].color} flex items-center justify-center shadow-lg`}>
                <span className="text-lg font-medium text-[#1e2026]">{conversations[selectedChat].initials}</span>
              </div>
              <div>
                <h2 className="font-medium text-lg text-[#f5f3ed]">{conversations[selectedChat].name}</h2>
                <p className="text-sm text-[#b8b5ad]">2 przecznice dalej</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-[#2a2d35] via-[#2a2d35] to-[#25292f]">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] rounded-[1.25rem] px-5 py-3 shadow-lg ${
                    msg.from === 'me'
                      ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]'
                      : 'backdrop-blur-md bg-[rgba(245,243,237,0.95)] text-[#2a2d35] border border-[#7dd3c0]/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Napisz wiadomość..."
                className="flex-1 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="w-14 h-14 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20"
              >
                <Send className="w-5 h-5 text-[#1e2026]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
