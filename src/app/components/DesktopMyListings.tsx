import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Clock, Eye, Users, Plus, Trash2, CheckCircle, X, ListTodo, HandHelping, UserCheck } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  currentUser, 
  getActiveListingsByUser, 
  getCompletedListingsByUser, 
  getUserById, 
  deleteListing, 
  completeListing,
  getApplicationsForListing,
  type Listing,
  type Application
} from '../../data/appData';

export default function DesktopMyListings() {
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState<Listing[]>(() => getActiveListingsByUser(currentUser.id));
  const [completedListings, setCompletedListings] = useState<Listing[]>(() => getCompletedListingsByUser(currentUser.id));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState<string | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedListingForComplete, setSelectedListingForComplete] = useState<Listing | null>(null);
  const [applicationsForListing, setApplicationsForListing] = useState<Application[]>([]);

  const refreshListings = () => {
    setActiveListings(getActiveListingsByUser(currentUser.id));
    setCompletedListings(getCompletedListingsByUser(currentUser.id));
  };

  const handleDelete = (listingId: string) => {
    deleteListing(listingId);
    refreshListings();
    setShowDeleteConfirm(null);
  };

  const handleOpenCompleteModal = (listing: Listing) => {
    const apps = getApplicationsForListing(listing.id);
    setApplicationsForListing(apps);
    setSelectedListingForComplete(listing);
    setShowCompleteConfirm(true);
  };

  // DesktopMyListings.tsx - poprawiona handleCompleteWithUser

  const handleCompleteWithUser = (completedWithUserId: string) => {
    if (selectedListingForComplete) {
      const completed = completeListing(selectedListingForComplete.id, completedWithUserId);
      if (completed) {
        refreshListings();
        // Dodatkowo: zamknij modal i wyczyść zgłoszenia
        setShowCompleteConfirm(false);
        setSelectedListingForComplete(null);
        setApplicationsForListing([]);
        
        // Opcjonalnie: pokaż komunikat sukcesu
        alert('Ogłoszenie zostało zakończone! Punkty zostały przyznane.');
      } else {
        alert('Nie można zakończyć tego ogłoszenia. Upewnij się, że wybrany użytkownik ma zaakceptowane zgłoszenie.');
      }
    }
  };

  const handleCreateNew = () => {
    setShowTypeModal(true);
  };

  const handleSelectType = (type: 'offer' | 'request') => {
    setShowTypeModal(false);
    if (type === 'offer') {
      navigate('/create-favor-request');
    } else {
      navigate('/create-help-request');
    }
  };

  // Sprawdź, czy ogłoszenie ma jakieś zgłoszenia
  const hasApplications = (listingId: string): boolean => {
    return getApplicationsForListing(listingId).length > 0;
  };

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[1440px] mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Moje Ogłoszenia</h1>
            <p className="text-sm text-[#b8b5ad]">{activeListings.length} aktywne ogłoszenia</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Dodaj Nowe
          </button>
        </header>

        {/* Modal wyboru typu ogłoszenia */}
        {showTypeModal && (
          <div className="fixed inset-0 bg-[rgba(42,45,53,0.9)] backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#7dd3c0]/20 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-[#f5f3ed]">Wybierz typ ogłoszenia</h2>
                <button onClick={() => setShowTypeModal(false)} className="w-10 h-10 rounded-xl bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40">
                  <X className="w-5 h-5 text-[#7dd3c0]" />
                </button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => handleSelectType('offer')}
                  className="w-full backdrop-blur-md bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center">
                    <HandHelping className="w-7 h-7 text-[#1e2026]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#f5f3ed] text-lg">Oferta</h3>
                    <p className="text-sm text-[#b8b5ad]">Udostępnij przedmiot lub usługę sąsiadom</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectType('request')}
                  className="w-full backdrop-blur-md bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center">
                    <ListTodo className="w-7 h-7 text-[#1e2026]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#f5f3ed] text-lg">Prośba</h3>
                    <p className="text-sm text-[#b8b5ad]">Poproś sąsiadów o pomoc</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {activeListings.length > 0 && (
            <div>
              <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Aktywne</h3>
              <div className="grid grid-cols-3 gap-4">
                {activeListings.map((item) => {
                  const hasApps = hasApplications(item.id);
                  return (
                    <div
                      key={item.id}
                      className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-2xl overflow-hidden shadow-xl hover:border-[#7dd3c0]/30 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                            item.listingType === 'offer' 
                              ? 'bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]'
                              : 'bg-gradient-to-r from-[#89cff0] to-[#7dd3c0] text-[#1e2026]'
                          }`}>
                            {item.listingType === 'offer' ? 'Oferta' : 'Prośba'}
                          </span>
                          {hasApps && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium shadow-lg bg-gradient-to-r from-[#89cff0] to-[#7dd3c0] text-[#1e2026] flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              Zgłoszenia
                            </span>
                          )}
                        </div>
                        {/* Action buttons overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleOpenCompleteModal(item)}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                            title="Oznacz jako zakończone"
                          >
                            <CheckCircle className="w-6 h-6 text-[#1e2026]" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e88d8d] to-[#c96b6b] flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                            title="Usuń ogłoszenie"
                          >
                            <Trash2 className="w-6 h-6 text-white" />
                          </button>
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
                            <span>{item.interestedCount} zainteresowanych</span>
                          </div>
                        </div>
                        {item.suggestedPoints && (
                          <div className="mt-2 text-xs text-[#89cff0]">
                            🎯 {item.suggestedPoints} pkt.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedListings.length > 0 && (
            <div>
              <h3 className="text-base font-medium text-[#f5f3ed] mb-4">Zakończone</h3>
              <div className="grid grid-cols-3 gap-4">
                {completedListings.map((item) => {
                  const completedWithUser = item.completedWithUserId ? getUserById(item.completedWithUserId) : null;
                  return (
                    <div
                      key={item.id}
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
                            Ukończone
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-base text-[#f5f3ed] mb-2">{item.title}</h4>
                        {completedWithUser && (
                          <div className="flex items-center gap-2 text-xs text-[#b8b5ad]">
                            <Clock className="w-4 h-4" />
                            <span>Wymieniono z: <span className="text-[#7dd3c0]">{completedWithUser.name}</span></span>
                          </div>
                        )}
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
                onClick={handleCreateNew}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-2xl"
              >
                Dodaj pierwsze ogłoszenie
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(42,45,53,0.9)] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#e88d8d]/30 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-medium text-[#f5f3ed] mb-4">Usuń ogłoszenie?</h2>
            <p className="text-sm text-[#b8b5ad] mb-6">Tej akcji nie można cofnąć. Ogłoszenie zostanie trwale usunięte.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed] hover:border-[#7dd3c0]/40 transition-all duration-300"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#e88d8d] to-[#c96b6b] text-white font-medium hover:shadow-xl transition-all duration-300"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal potwierdzenia zakończenia z wyborem użytkownika */}
      {showCompleteConfirm && selectedListingForComplete && (
        <div className="fixed inset-0 bg-[rgba(42,45,53,0.9)] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#7dd3c0]/30 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#f5f3ed]">Zakończ ogłoszenie</h2>
              <button 
                onClick={() => {
                  setShowCompleteConfirm(false);
                  setSelectedListingForComplete(null);
                  setApplicationsForListing([]);
                }}
                className="w-8 h-8 rounded-full bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40"
              >
                <X className="w-4 h-4 text-[#7dd3c0]" />
              </button>
            </div>
            
            <p className="text-sm text-[#b8b5ad] mb-4">
              Wybierz użytkownika, który pomógł przy tym ogłoszeniu.
              {selectedListingForComplete.suggestedPoints && (
                <span className="block mt-2 text-[#7dd3c0]">
                  🎯 Punkty do przyznania: {selectedListingForComplete.suggestedPoints}
                </span>
              )}
            </p>

            {applicationsForListing.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[#b8b5ad] mb-3">Brak zgłoszonych użytkowników</p>
                <p className="text-xs text-[#b8b5ad]">
                  Użytkownicy muszą zgłosić się przez czat, aby mogli zostać wybrani.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                {applicationsForListing.map((app) => {
                  const user = getUserById(app.userId);
                  if (!user) return null;
                  return (
                    <button
                      key={app.userId}
                      onClick={() => handleCompleteWithUser(app.userId)}
                      className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-xl p-3 hover:border-[#7dd3c0]/30 hover:bg-[rgba(125,211,192,0.1)] transition-all duration-300 text-left flex items-center gap-3"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-sm font-medium text-[#1e2026]">{user.initials}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#f5f3ed]">{user.name}</p>
                        <p className="text-xs text-[#b8b5ad] truncate">{app.message}</p>
                      </div>
                      <div className="text-xs text-[#7dd3c0]">
                        {new Date(app.appliedAt).toLocaleDateString('pl-PL')}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  setShowCompleteConfirm(false);
                  setSelectedListingForComplete(null);
                  setApplicationsForListing([]);
                }}
                className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed] hover:border-[#7dd3c0]/40 transition-all duration-300"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
