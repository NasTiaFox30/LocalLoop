import { ArrowLeft, Repeat, Star, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ListingDetailProps {
  onNavigate: (screen: string) => void;
}

export default function ListingDetail({ onNavigate }: ListingDetailProps) {
  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <div className="relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGRyaWxsJTIwdG9vbCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3OTI4MjI3MHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Wiertarka udarowa"
            className="w-full aspect-[4/3] object-cover"
          />
          <button
            onClick={() => onNavigate('request')}
            className="absolute top-4 left-4 w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(42,45,53,0.8)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-lg">
              <span className="text-lg font-medium text-[#1e2026]">AK</span>
            </div>
            <div>
              <h2 className="font-medium text-[#f5f3ed]">Anna Kowalska</h2>
              <p className="text-xs text-[#b8b5ad]">2 przecznice dalej • Członek od 2023</p>
            </div>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
            <h3 className="text-sm font-medium text-[#7dd3c0] mb-3">Opis</h3>
            <p className="text-sm text-[#f5f3ed] leading-relaxed">
              Cześć! To moja wiertarka udarowa Bosch Professional, gotowa na Twoje projekty domowe. Jest w świetnym stanie, z baterią i ładowarką. Idealnie sprawdzi się do montażu mebli czy drobnych napraw. Chętnie podzielę się nią z sąsiadami! 🌱
            </p>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#89cff0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
            <h3 className="text-sm font-medium text-[#89cff0] mb-4">Sugerowana Wartość</h3>

            <div className="space-y-3">
              <div className="backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Repeat className="w-5 h-5 text-[#1e2026]" />
                </div>
                <div>
                  <p className="text-xs text-[#b8b5ad]">Wymiana barterowa</p>
                  <p className="text-sm text-[#f5f3ed] font-medium">Ciasto drożdżowe lub pomoc w ogrodzie</p>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Star className="w-5 h-5 text-[#1e2026]" />
                </div>
                <div>
                  <p className="text-xs text-[#b8b5ad]">Punkty społecznościowe</p>
                  <p className="text-sm text-[#f5f3ed] font-medium">85 punktów</p>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-4 mb-20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#b8b5ad]">Dostępność</p>
                <p className="text-sm text-[#f5f3ed] font-medium">Dostępne od zaraz</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                Aktywne
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-md bg-gradient-to-t from-[rgba(42,45,53,0.95)] to-[rgba(42,45,53,0.8)] border-t border-[#7dd3c0]/15">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => onNavigate('chat')}
              className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Chatuj z Anną
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
