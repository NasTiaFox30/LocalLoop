import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ImagePlus, Check, Loader2, Wand2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { currentUser, addListing, favorCategories } from '../../data/appData';
import { generateRandomHelpContent } from '../../data/textsAI_templates';

export default function CreateHelpRequest() {
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
  const [urgency, setUrgency] = useState('Jak najszybciej');

  const categories = favorCategories.map(c => c.label);
  const uniqueCategories = [...new Set(categories)];

  const handleImageClick = () => {
    const demoImageUrl = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800';
    setImageUrl(demoImageUrl);
    setImageUploaded(true);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const generated = generateRandomHelpContent();
    setTitle(generated.title);
    setDescription(generated.description);
    setSuggestedBarter(generated.suggestedBarter);
    setSuggestedPoints(generated.suggestedPoints);
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Proszę podać tytuł prośby');
      return;
    }
    if (!description.trim()) {
      alert('Proszę podać opis');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    addListing({
      ownerId: currentUser.id,
      title: title.trim(),
      description: description.trim(),
      image: imageUploaded ? imageUrl : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      status: 'active',
      category: category,
      listingType: 'request',
      suggestedBarter: suggestedBarter || undefined,
      suggestedPoints: suggestedPoints || undefined,
    });

    setIsLoading(false);
    navigate('/my-listings');
  };

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/my-listings')}
              className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
            </button>
            <div>
              <h1 className="font-medium text-[#f5f3ed]">Dodaj Prośbę</h1>
              <p className="text-sm text-[#b8b5ad]">Poproś sąsiadów o pomoc</p>
            </div>
          </div>
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#89cff0]/20 to-[#7dd3c0]/20 border border-[#7dd3c0]/40 text-[#7dd3c0] text-sm font-medium flex items-center gap-1"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            AI
          </button>
        </header>

        {/* Reszta komponentu bez zmian - ten sam kod co wcześniej */}
        <div className="space-y-4">
          {/* Zdjęcie */}
          <div
            onClick={handleImageClick}
            className="relative w-full aspect-[4/3] rounded-[2rem] border-2 border-dashed border-[#7dd3c0]/30 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.4)] to-[rgba(50,55,65,0.2)] overflow-hidden cursor-pointer hover:border-[#7dd3c0]/50 transition-all duration-500 group shadow-xl"
          >
            {!imageUploaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <ImagePlus className="w-8 h-8 text-[#7dd3c0]" />
                </div>
                <p className="text-sm text-[#f5f3ed] font-medium">Dodaj zdjęcie (opcjonalnie)</p>
              </div>
            ) : (
              <ImageWithFallback
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Tytuł */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Tytuł *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Np. Potrzebuję pomocy przy przeprowadzce"
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
              placeholder="Opisz szczegółowo, czego potrzebujesz..."
              rows={4}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300 resize-none"
            />
          </div>

          {/* Co możesz zaoferować */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Co możesz zaoferować w zamian? (opcjonalnie)</label>
            <input
              type="text"
              value={suggestedBarter}
              onChange={(e) => setSuggestedBarter(e.target.value)}
              placeholder="Np. Domowe ciasto"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>

          {/* Sugerowane punkty */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Punkty społecznościowe (opcjonalnie)</label>
            <input
              type="number"
              value={suggestedPoints}
              onChange={(e) => setSuggestedPoints(parseInt(e.target.value) || 0)}
              placeholder="Np. 50"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>

          {/* Pilność */}
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Kiedy potrzebujesz pomocy?</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            >
              <option>Jak najszybciej</option>
              <option>W tym tygodniu</option>
              <option>W przyszłym tygodniu</option>
              <option>Elastycznie</option>
            </select>
          </div>

          {/* Przyciski */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate('/my-listings')}
              className="flex-1 py-4 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed]"
            >
              Anuluj
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {isLoading ? 'Publikuję...' : 'Opublikuj'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}