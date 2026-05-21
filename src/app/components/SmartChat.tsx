import { useState } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

interface SmartChatProps {
  onNavigate: (screen: string) => void;
}

export default function SmartChat({ onNavigate }: SmartChatProps) {
  const [messages, setMessages] = useState([
    { from: 'them', text: "Cześć! Widzę, że oferujesz wiertarkę. Czy jest nadal dostępna?" },
    { from: 'me', text: "Tak, jest! Kiedy byś jej potrzebował/a?" },
    { from: 'them', text: "W sobotę planuję montaż półek. Czy mogłabym pożyczyć ją na weekend?" },
  ]);
  const [inputValue, setInputValue] = useState('');

  const icebreakers = [
    "Hej, mogę w zamian przynieść domową kawę! ☕",
    "Cześć! Kiedy pasuje Ci odbiór?",
    "Chętnie pomogę w ogrodzie w zamian 🌱",
  ];

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      setMessages([...messages, { from: 'me', text }]);
      setInputValue('');
    }
  };

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <header className="flex items-center gap-3 p-4 border-b border-[#7dd3c0]/15 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.6)] to-[rgba(50,55,65,0.4)]">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-11 h-11 rounded-2xl backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div className="flex-1">
            <h2 className="font-medium text-[#f5f3ed]">Anna Kowalska</h2>
            <p className="text-xs text-[#b8b5ad]">2 przecznice dalej</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-lg border-2 border-[#7dd3c0]/30">
            <span className="text-sm font-medium text-[#1e2026]">AK</span>
          </div>
        </header>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-[#2a2d35] via-[#2a2d35] to-[#25292f]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-[1.25rem] px-5 py-3 shadow-lg ${
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
