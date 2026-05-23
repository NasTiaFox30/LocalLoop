import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import {
  Camera,
  Sparkles,
  ArrowLeft,
  Check,
  Repeat,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

interface CreateFavorRequestProps {
}

export default function CreateFavorRequest({}: CreateFavorRequestProps) {
  const navigate = useNavigate();
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleImageClick = () => {
    setImageUploaded(true);
  };

  const aiDescription =
    "Cześć! To moja wiertarka udarowa Bosch Professional, gotowa na Twoje projekty domowe. Jest w świetnym stanie, z baterią i ładowarką. Idealnie sprawdzi się do montażu mebli czy drobnych napraw. Chętnie podzielę się nią z sąsiadami! 🌱";

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-3 mb-6 pt-4">
          <button
            onClick={() => navigate("dashboard")}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div>
            <h1 className="font-medium text-[#f5f3ed]">
              Portal Tworzenia
            </h1>
            <p className="text-sm text-[#b8b5ad]">
              Stwórz nowe ogłoszenie z AI
            </p>
          </div>
        </header>

        <div
          onClick={handleImageClick}
          className="relative w-full aspect-[4/3] rounded-[2rem] border-2 border-dashed border-[#7dd3c0]/30 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.4)] to-[rgba(50,55,65,0.2)] overflow-hidden mb-5 cursor-pointer hover:border-[#7dd3c0]/50 transition-all duration-500 group shadow-2xl"
        >
          {!imageUploaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Camera className="w-10 h-10 text-[#7dd3c0]" />
              </div>
              <p className="text-sm text-[#f5f3ed] font-medium">
                Dodaj zdjęcie przedmiotu
              </p>
              <p className="text-xs text-[#b8b5ad] mt-2">
                AI przeanalizuje je automatycznie
              </p>
            </div>
          ) : (
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGRyaWxsJTIwdG9vbCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3OTI4MjI3MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Power drill on workbench"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {imageUploaded && (
          <>
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-[#1e2026]" />
                </div>
                <label className="text-sm text-[#f5f3ed] font-medium">
                  Opis Wygenerowany przez AI
                </label>
              </div>
              <div className="backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl p-4">
                <p className="text-sm text-[#f5f3ed] leading-relaxed">
                  {aiDescription}
                </p>
              </div>
            </div>

            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#89cff0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-[#1e2026]" />
                </div>
                <label className="text-sm text-[#f5f3ed] font-medium">
                  Sugerowana Wartość
                </label>
              </div>

              <div className="space-y-3">
                <div className="backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Repeat className="w-5 h-5 text-[#1e2026]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#b8b5ad]">
                      Wymiana barterowa
                    </p>
                    <p className="text-sm text-[#f5f3ed] font-medium">
                      Ciasto drożdżowe lub pomoc w ogrodzie
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Star className="w-5 h-5 text-[#1e2026]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#b8b5ad]">
                      Punkty społecznościowe
                    </p>
                    <p className="text-sm text-[#f5f3ed] font-medium">
                      85 punktów
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#b8b5ad] mt-3 text-center">
                AI sugeruje na podstawie podobnych przedmiotów
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-[#b8b5ad] mb-2 block">
                  Dostępność
                </label>
                <select className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 rounded-2xl p-4 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300">
                  <option>Dostępne od zaraz</option>
                  <option>Dostępne w tym tygodniu</option>
                  <option>Dostępne w przyszłym tygodniu</option>
                </select>
              </div>

              <button
                onClick={() => navigate("dashboard")}
                className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#7dd3c0]/20"
              >
                <Check className="w-5 h-5" />
                Opublikuj w Społeczności
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}