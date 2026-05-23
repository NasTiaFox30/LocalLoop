import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Users, Plus } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface DesktopMyListingsProps {
}

export default function DesktopMyListings({}: DesktopMyListingsProps) {
  const navigate = useNavigate();
  const activeListings = [
    { title: 'Wiertarka udarowa Bosch', image: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=400', status: 'Aktywne', views: 24, interested: 3 },
    { title: 'Sekator ogrodowy', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', status: 'Aktywne', views: 12, interested: 1 },
    { title: 'Kosiarka elektryczna', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', status: 'Aktywne', views: 18, interested: 2 },
  ];

  const pastListings = [
    { title: 'Drabina aluminiowa', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400', status: 'Ukończone', completedWith: 'Piotr N.' },
    { title: 'Młotek udarowy', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', status: 'Ukończone', completedWith: 'Anna K.' },
  ];

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Moje Ogłoszenia</h1>
            <p className="text-sm text-[#b8b5ad]">{activeListings.length} aktywne ogłoszenia</p>
          </div>
          <button
            onClick={() => navigate('/listing')}
            className="px-6 py-3 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Dodaj Nowe
          </button>
        </header>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Aktywne</h3>
            <div className="grid grid-cols-3 gap-4">
              {activeListings.map((item, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-2xl overflow-hidden shadow-xl hover:border-[#7dd3c0]/30 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-xs font-medium text-[#1e2026] shadow-lg">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-base text-[#f5f3ed] mb-3">{item.title}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-xs text-[#b8b5ad]">
                        <Eye className="w-4 h-4" />
                        <span>{item.views} wyświetleń</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#7dd3c0]">
                        <Users className="w-4 h-4" />
                        <span>{item.interested} zainteresowanych</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Zakończone</h3>
            <div className="grid grid-cols-3 gap-4">
              {pastListings.map((item, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl overflow-hidden shadow-xl opacity-75"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-[rgba(60,65,75,0.8)] border border-[#b8b5ad]/20 text-xs font-medium text-[#b8b5ad]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-base text-[#f5f3ed] mb-2">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#b8b5ad]">
                      <Clock className="w-4 h-4" />
                      <span>Wymieniono z: <span className="text-[#7dd3c0]">{item.completedWith}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
