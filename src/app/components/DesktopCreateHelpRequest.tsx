import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ImagePlus, Check, ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface DesktopCreateHelpRequestProps {
}

export default function DesktopCreateHelpRequest({}: DesktopCreateHelpRequestProps) {
  const navigate = useNavigate();
  const [imageUploaded, setImageUploaded] = useState(false);
  const [requestText, setRequestText] = useState('');

  const handleImageClick = () => {
    setImageUploaded(true);
  };

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[800px] mx-auto p-8 min-h-screen flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Dodaj Prośbę</h1>
          <p className="text-sm text-[#b8b5ad]">Opisz, czego potrzebujesz</p>
        </div>

        <div className="space-y-5">
          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 shadow-xl">
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
            className="relative w-full aspect-[16/9] rounded-[1.5rem] border-2 border-dashed border-[#7dd3c0]/30 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.4)] to-[rgba(50,55,65,0.2)] overflow-hidden cursor-pointer hover:border-[#7dd3c0]/50 transition-all duration-500 group shadow-xl"
          >
            {!imageUploaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-[1.25rem] bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <ImagePlus className="w-10 h-10 text-[#7dd3c0]" />
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

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#89cff0]/15 rounded-[1.5rem] p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-[#1e2026]" />
              </div>
              <label className="text-sm text-[#f5f3ed] font-medium">Co możesz zaoferować w zamian?</label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-4 flex items-center gap-3 hover:bg-[#7dd3c0]/20 hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Repeat className="w-6 h-6 text-[#1e2026]" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs text-[#b8b5ad]">Wymiana barterowa</p>
                  <p className="text-sm text-[#f5f3ed] font-medium">Ciasto lub pomoc</p>
                </div>
              </button>

              <button className="backdrop-blur-sm bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-4 flex items-center gap-3 hover:bg-[#89cff0]/20 hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Star className="w-6 h-6 text-[#1e2026]" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs text-[#b8b5ad]">Punkty</p>
                  <p className="text-sm text-[#f5f3ed] font-medium">50-100 pkt</p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#b8b5ad] mb-2 block">Kiedy potrzebujesz pomocy?</label>
              <select className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 rounded-2xl p-3 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300">
                <option>Jak najszybciej</option>
                <option>W tym tygodniu</option>
                <option>W przyszłym tygodniu</option>
                <option>Elastycznie</option>
              </select>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-3 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center justify-center gap-2 mt-auto"
            >
              <Check className="w-5 h-5" />
              Opublikuj Prośbę
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}