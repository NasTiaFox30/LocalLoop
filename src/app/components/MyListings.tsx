import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { myListings, pastListings } from '../../data/appData';

export default function MyListings() {
  const navigate = useNavigate();
  const activeListings = myListings.filter(l => l.status === 'Aktywne');

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-3 mb-6 pt-4">
          <button
            onClick={() => navigate('/profile')}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div>
            <h1 className="font-medium text-[#f5f3ed]">Moje Ogłoszenia</h1>
            <p className="text-sm text-[#b8b5ad]">{activeListings.length} aktywne</p>
          </div>
        </header>

        {/* Active listings */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Aktywne</h3>
          <div className="space-y-4">
            {activeListings.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-2xl overflow-hidden shadow-xl hover:border-[#7dd3c0]/30 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-3 pr-4">
                    <h4 className="font-medium text-[#f5f3ed] mb-2">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#b8b5ad]">
                      <span>{item.views} wyświetleń</span>
                      <span>•</span>
                      <span className="text-[#7dd3c0]">{item.interested} zainteresowanych</span>
                    </div>
                    <div className="mt-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past listings */}
        <div>
          <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Zakończone</h3>
          <div className="space-y-4">
            {pastListings.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl overflow-hidden shadow-xl opacity-75"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  <div className="flex-1 py-3 pr-4">
                    <h4 className="font-medium text-[#f5f3ed] mb-2">{item.title}</h4>
                    {item.completedWith && (
                      <div className="text-xs text-[#b8b5ad] mb-2">
                        Wymieniono z: <span className="text-[#7dd3c0]">{item.completedWith}</span>
                      </div>
                    )}
                    <div>
                      <span className="px-3 py-1 rounded-full bg-[rgba(60,65,75,0.5)] border border-[#b8b5ad]/20 text-xs text-[#b8b5ad]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
