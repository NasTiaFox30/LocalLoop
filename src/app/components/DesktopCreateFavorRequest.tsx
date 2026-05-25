import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Camera, Check, ArrowLeft, Loader2, Wand2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { getCurrentUser, addListing, favorCategories } from '../../data/firebaseData';
import { generateRandomOfferContent } from '../../data/textsAI_templates';

interface DesktopCreateFavorRequestProps {}

export default function DesktopCreateFavorRequest({}: DesktopCreateFavorRequestProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(favorCategories[0].label);
  const [suggestedBarter, setSuggestedBarter] = useState('');
  const [suggestedPoints, setSuggestedPoints] = useState<number>(50);
  const [availability, setAvailability] = useState('Dostępne od zaraz');

  const categories = favorCategories.map(c => c.label);
  const uniqueCategories = [...new Set(categories)];

  const handleImageClick = () => {
    const demoImageUrl = 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=800';
    setImageUrl(demoImageUrl);
    setImageUploaded(true);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const generated = generateRandomOfferContent();
    setTitle(generated.title);
    setDescription(generated.description);
    setSuggestedBarter(generated.suggestedBarter);
    setSuggestedPoints(generated.suggestedPoints);
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Proszę podać tytuł ogłoszenia');
      return;
    }
    if (!description.trim()) {
      alert('Proszę podać opis');
      return;
    }
    if (!imageUploaded) {
      alert('Proszę dodać zdjęcie');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Musisz być zalogowany');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      await addListing({
        ownerId: currentUser.id,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl,
        status: 'active',
        category: category,
        listingType: 'offer',
        suggestedBarter: suggestedBarter || undefined,
        suggestedPoints: suggestedPoints || undefined,
      });
      navigate('/my-listings');
    } catch (error) {
      console.error('Failed to add listing:', error);
      alert('Wystąpił błąd podczas publikowania ogłoszenia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[800px] mx-auto p-8 min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/my-listings')}
              className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
            </button>
            <div>
              <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Dodaj Ofertę</h1>
              <p className="text-sm text-[#b8b5ad]">Udostępnij przedmiot lub usługę sąsiadom</p>
            </div>
          </div>
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#89cff0]/20 to-[#7dd3c0]/20 border border-[#7dd3c0]/40 text-[#7dd3c0] font-medium flex items-center gap-2 hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {isGenerating ? 'Generowanie...' : 'Generuj (AI)'}
          </button>
        </div>

        {/* Reszta komponentu bez zmian - formularz */}
        <div className="space-y-6">
          {/* Zdjęcie */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Zdjęcie *</label>
            <div
              onClick={handleImageClick}
              className="relative w-full aspect-[16/9] rounded-[1.5rem] border-2 border-dashed border-[#7dd3c0]/30 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.4)] to-[rgba(50,55,65,0.2)] overflow-hidden cursor-pointer hover:border-[#7dd3c0]/50 transition-all duration-500 group shadow-2xl"
            >
              {!imageUploaded ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Camera className="w-12 h-12 text-[#7dd3c0]" />
                  </div>
                  <p className="text-base font-medium text-[#f5f3ed]">Dodaj zdjęcie przedmiotu</p>
                  <p className="text-sm text-[#b8b5ad] mt-2">Kliknij, aby dodać zdjęcie</p>
                </div>
              ) : (
                <ImageWithFallback
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Tytuł */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Tytuł *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Np. Wiertarka Bosch Professional"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>

          {/* Kategoria */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Kategoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            >
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Opis */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Opis *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opisz szczegółowo przedmiot lub usługę..."
              rows={4}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300 resize-none"
            />
          </div>

          {/* Sugerowana wymiana barterowa */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Sugerowana wymiana (opcjonalnie)</label>
            <input
              type="text"
              value={suggestedBarter}
              onChange={(e) => setSuggestedBarter(e.target.value)}
              placeholder="Np. Ciasto drożdżowe lub pomoc w ogrodzie"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>

          {/* Sugerowane punkty */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Sugerowane punkty społecznościowe (opcjonalnie)</label>
            <input
              type="number"
              value={suggestedPoints}
              onChange={(e) => setSuggestedPoints(parseInt(e.target.value) || 0)}
              placeholder="Np. 50"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>

          {/* Dostępność */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Dostępność</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            >
              <option>Dostępne od zaraz</option>
              <option>Dostępne w tym tygodniu</option>
              <option>Dostępne w przyszłym tygodniu</option>
            </select>
          </div>

          {/* Przyciski */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate('/my-listings')}
              className="flex-1 px-6 py-4 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed] hover:border-[#7dd3c0]/40 transition-all duration-300"
            >
              Anuluj
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {isLoading ? 'Publikowanie...' : 'Opublikuj w Społeczności'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
