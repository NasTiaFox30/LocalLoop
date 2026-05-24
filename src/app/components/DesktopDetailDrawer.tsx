import { X, Repeat, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';
import { getListingById, getUserById, currentUser } from '../../data/appData';

interface DesktopDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onChat: () => void;
  item?: { listingId: string };
}

export default function DesktopDetailDrawer({ isOpen, onClose, onChat, item }: DesktopDetailDrawerProps) {
  const navigate = useNavigate();
  const listing = item?.listingId ? getListingById(item.listingId) : null;
  const owner = listing ? getUserById(listing.ownerId) : null;

  if (!listing || !owner) return null;

  const isOffer = listing.listingType === 'offer';
  const isOwnListing = owner.id === currentUser.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="hidden lg:block fixed inset-0 bg-[rgba(42,45,53,0.8)] backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="hidden lg:block fixed right-0 top-0 h-screen w-[600px] backdrop-blur-2xl bg-gradient-to-b from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border-l border-[#7dd3c0]/20 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-[rgba(42,45,53,0.9)] border-b border-[#7dd3c0]/15 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-[#f5f3ed]">Szczegóły Ogłoszenia</h2>
                <button
                  onClick={onClose}
                  className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 hover:scale-110 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-[#7dd3c0]" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl">
                <ImageWithFallback
                  src={listing.image}
                  alt={listing.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${owner.avatarColor} flex items-center justify-center shadow-lg`}>
                  <span className="text-xl font-medium text-[#1e2026]">{owner.initials}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#f5f3ed]">{owner.name}</h3>
                  <p className="text-sm text-[#b8b5ad]">{owner.neighborhood} • Członek od {owner.memberSince.split(' ')[1]}</p>
                </div>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 mb-4 shadow-xl">
                <h3 className="text-sm font-medium text-[#7dd3c0] mb-3">{isOffer ? 'Opis oferty' : 'Opis prośby'}</h3>
                <p className="text-sm text-[#f5f3ed] leading-relaxed">{listing.description}</p>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#89cff0]/15 rounded-[1.5rem] p-5 mb-6 shadow-xl">
                <h3 className="text-sm font-medium text-[#89cff0] mb-4">Sugerowana Wartość</h3>

                <div className="space-y-3">
                  {listing.suggestedBarter && (
                    <div className="backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-4 flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Repeat className="w-6 h-6 text-[#1e2026]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#b8b5ad]">Wymiana barterowa</p>
                        <p className="text-sm text-[#f5f3ed] font-medium">{listing.suggestedBarter}</p>
                      </div>
                    </div>
                  )}

                  {listing.suggestedPoints && (
                    <div className="backdrop-blur-sm bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-4 flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Star className="w-6 h-6 text-[#1e2026]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#b8b5ad]">Punkty społecznościowe</p>
                        <p className="text-sm text-[#f5f3ed] font-medium">{listing.suggestedPoints} punktów</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Przycisk czatu - pokazuje się tylko jeśli to NIE jest własne ogłoszenie */}
              {!isOwnListing && listing.status === 'active' && (
                <button
                  onClick={() => {
                    onChat();
                    navigate('/messages', { state: { listingId: listing.id, ownerId: owner.id } });
                  }}
                  className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/40 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chatuj z {owner.name.split(' ')[0]}
                </button>
              )}

              {/* Komunikat dla własnego ogłoszenia */}
              {isOwnListing && listing.status === 'active' && (
                <div className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.3)] border border-[#7dd3c0]/20 rounded-2xl py-4 px-6 text-center">
                  <p className="text-sm text-[#b8b5ad]">~ To Twoje ogłoszenie ~</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}