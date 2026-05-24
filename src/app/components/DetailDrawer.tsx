import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Repeat, Star, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { getListingById, getUserById, timeAgo, currentUser } from '../../data/appData';

export default function DetailDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const listingId = location.state?.listingId;
  const listing = listingId ? getListingById(listingId) : null;
  const owner = listing ? getUserById(listing.ownerId) : null;

  if (!listing || !owner) {
    return (
      <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex items-center justify-center">
        <p>Ogłoszenie nie zostało znalezione</p>
      </div>
    );
  }

  const isOffer = listing.listingType === 'offer';
  const isOwnListing = owner.id === currentUser.id;

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col pb-20">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <div className="relative">
          <ImageWithFallback
            src={listing.image}
            alt={listing.title}
            className="w-full aspect-[4/3] object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(42,45,53,0.8)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${owner.avatarColor} flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-medium text-[#1e2026]">{owner.initials}</span>
            </div>
            <div>
              <h2 className="font-medium text-[#f5f3ed]">{owner.name}</h2>
              <p className="text-xs text-[#b8b5ad]">{owner.neighborhood} • Członek od {owner.memberSince.split(' ')[1]}</p>
            </div>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
            <h3 className="text-sm font-medium text-[#7dd3c0] mb-3">{isOffer ? 'Opis oferty' : 'Opis prośby'}</h3>
            <p className="text-sm text-[#f5f3ed] leading-relaxed">{listing.description}</p>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#89cff0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
            <h3 className="text-sm font-medium text-[#89cff0] mb-4">Sugerowana Wartość</h3>

            <div className="space-y-3">
              {listing.suggestedBarter && (
                <div className="backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Repeat className="w-5 h-5 text-[#1e2026]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#b8b5ad]">Wymiana barterowa</p>
                    <p className="text-sm text-[#f5f3ed] font-medium">{listing.suggestedBarter}</p>
                  </div>
                </div>
              )}

              {listing.suggestedPoints && (
                <div className="backdrop-blur-sm bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Star className="w-5 h-5 text-[#1e2026]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#b8b5ad]">Punkty społecznościowe</p>
                    <p className="text-sm text-[#f5f3ed] font-medium">{listing.suggestedPoints} punktów</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-4 mb-20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#b8b5ad]">Dodano</p>
                <p className="text-sm text-[#f5f3ed] font-medium">{timeAgo(listing.createdAt)}</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 text-xs text-[#7dd3c0]">
                {listing.status === 'active' ? 'Aktywne' : 'Zakończone'}
              </div>
            </div>
          </div>

          {listing.status === 'active' && (
            <div className="backdrop-blur-md bg-gradient-to-t from-[rgba(42,45,53,0.95)] to-[rgba(42,45,53,0.8)] border-t border-[#7dd3c0]/15">
              <div className="max-w-md mx-auto">
                <button
                  onClick={() => navigate('/chat', { state: { listingId: listing.id, ownerId: owner.id } })}
                  className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chatuj z {owner.name.split(' ')[0]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}