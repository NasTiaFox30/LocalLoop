import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Users } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { currentUser, getActiveListingsByUser, getCompletedListingsByUser, getUserById } from '../../data/appData';

export default function MyListings() {
  const navigate = useNavigate();
  const activeListings = getActiveListingsByUser(currentUser.id);
  const completedListings = getCompletedListingsByUser(currentUser.id);

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
        {activeListings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Aktywne</h3>
            <div className="space-y-4">
              {activeListings.map((item) => (
                <div
                  key={item.id}
                  className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-2xl overflow-hidden shadow-xl hover:border-[#7dd3c0]/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-auto flex-shrink-0 relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 py-3 pr-4">
                      <h4 className="font-medium text-[#f5f3ed] mb-2">{item.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#b8b5ad]">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#7dd3c0]"><Users className="w-3 h-3" /> {item.interestedCount}</span>
                      </div>
                      <div className="mt-2">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                          {item.status === 'active' ? 'Aktywne' : item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past listings */}
        {completedListings.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Zakończone</h3>
            <div className="space-y-4">
              {completedListings.map((item) => {
                const completedWithUser = item.completedWithUserId ? getUserById(item.completedWithUserId) : null;
                return (
                  <div
                    key={item.id}
                    className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl overflow-hidden shadow-xl opacity-75"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-auto flex-shrink-0 relative">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                      </div>
                      <div className="flex-1 py-3 pr-4">
                        <h4 className="font-medium text-[#f5f3ed] mb-2">{item.title}</h4>
                        {completedWithUser && (
                          <div className="text-xs text-[#b8b5ad] mb-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Wymieniono z: <span className="text-[#7dd3c0]">{completedWithUser.name}</span>
                          </div>
                        )}
                        <div>
                          <span className="px-3 py-1 rounded-full bg-[rgba(60,65,75,0.5)] border border-[#b8b5ad]/20 text-xs text-[#b8b5ad]">
                            Ukończone
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeListings.length === 0 && completedListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#b8b5ad]">Nie masz jeszcze żadnych ogłoszeń</p>
            <button
              onClick={() => navigate('/listing')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-2xl"
            >
              Dodaj pierwsze ogłoszenie
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
