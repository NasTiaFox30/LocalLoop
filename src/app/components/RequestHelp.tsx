import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Wrench, Car, BookOpen, Home, Heart, Utensils, Plus } from 'lucide-react';
import { favorCategories, getRequests, getUserById, timeAgo } from '../../data/appData';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench, Car, BookOpen, Home, Heart, Utensils,
};

export default function RequestHelp() {
  const navigate = useNavigate();
  const [imageUploaded, setImageUploaded] = useState(false);
  const [requestText, setRequestText] = useState('');

  const handleImageClick = () => {
    setImageUploaded(true);
  };

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-3 mb-6 pt-4">
          <button
            onClick={() => navigate('/request')}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div>
            <h1 className="font-medium text-[#f5f3ed]">Dodaj Prośbę</h1>
            <p className="text-sm text-[#b8b5ad]">Opisz, czego potrzebujesz</p>
          </div>
        </header>

        <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 mb-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-[#1e2026]" />
            </div>
            <label className="text-sm text-[#f5f3ed] font-medium">Twoja Prośba</label>
          </div>
          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="Np. Potrzebuję kogoś do wniesienia kanapy na 3 piętro..."
            className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl p-4 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] resize-none focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300 min-h-[120px]"
          />
        </div>

        <div
          onClick={handleImageClick}
          className="relative w-full aspect-[4/3] rounded-[2rem] border-2 border-dashed border-[#7dd3c0]/30 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.4)] to-[rgba(50,55,65,0.2)] overflow-hidden mb-5 cursor-pointer hover:border-[#7dd3c0]/50 transition-all duration-500 group shadow-xl"
        >
          {!imageUploaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <ImagePlus className="w-8 h-8 text-[#7dd3c0]" />
              </div>
              <p className="text-sm text-[#f5f3ed] font-medium">Dodaj zdjęcie (opcjonalnie)</p>
              <p className="text-xs text-[#b8b5ad] mt-2">Pomaga sąsiadom lepiej zrozumieć</p>
            </div>
          ) : (
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
              alt="Sofa reference"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#89cff0]/15 rounded-[1.5rem] p-5 mb-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-[#1e2026]" />
            </div>
            <label className="text-sm text-[#f5f3ed] font-medium">Co możesz zaoferować w zamian?</label>
          </div>

          <div className="space-y-3">
            <button className="w-full backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-4 flex items-center gap-3 hover:bg-[#7dd3c0]/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center flex-shrink-0 shadow-md">
                <Repeat className="w-5 h-5 text-[#1e2026]" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-[#b8b5ad]">Wymiana barterowa</p>
                <p className="text-sm text-[#f5f3ed] font-medium">Np. domowe ciasto, pomoc w ogrodzie</p>
              </div>
            </button>

            <button className="w-full backdrop-blur-sm bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-4 flex items-center gap-3 hover:bg-[#89cff0]/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center flex-shrink-0 shadow-md">
                <Star className="w-5 h-5 text-[#1e2026]" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-[#b8b5ad]">Punkty społecznościowe</p>
                <p className="text-sm text-[#f5f3ed] font-medium">50-100 punktów</p>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Kiedy potrzebujesz pomocy?</label>
            <select className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 rounded-2xl p-4 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300">
              <option>Jak najszybciej</option>
              <option>W tym tygodniu</option>
              <option>W przyszłym tygodniu</option>
              <option>Elastycznie</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Opublikuj Prośbę
          </button>
        </div>
      </div>
    </div>
  );
}
