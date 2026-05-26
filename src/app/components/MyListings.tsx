import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Eye, Users, Trash2, CheckCircle, X, Plus, HandHelping, ListTodo, UserCheck } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  getCurrentUser, 
  getActiveListingsByUser, 
  getCompletedListingsByUser, 
  getUserById, 
  deleteListing, 
  completeListing,
  getApplicationsForListing,
  type Listing,
  type Application,
  type User
} from '../../data/firebaseData';

// Komponent dla pojedynczego zakończonego ogłoszenia
function CompletedListingItem({ listing }: { listing: Listing }) {
  const [completedWithUser, setCompletedWithUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (listing.completedWithUserId) {
        const user = await getUserById(listing.completedWithUserId);
        setCompletedWithUser(user);
      }
    };
    loadUser();
  }, [listing.completedWithUserId]);

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl overflow-hidden shadow-xl opacity-75">
      <div className="flex gap-4">
        <div className="w-24 h-auto flex-shrink-0 relative">
          <ImageWithFallback
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="flex-1 py-3 pr-4">
          <h4 className="font-medium text-[#f5f3ed] mb-2">{listing.title}</h4>
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
}

// Komponent dla zgłoszenia w modalu
function ApplicationItem({ 
  application, 
  onComplete,
  onClose
}: { 
  application: Application; 
  onComplete: (userId: string) => void;
  onClose: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getUserById(application.userId);
      setUser(u);
      setLoading(false);
    };
    loadUser();
  }, [application.userId]);

  if (loading) {
    return (
      <div className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-xl p-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <button
      onClick={() => {
        onComplete(application.userId);
        onClose();
      }}
      className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-xl p-3 hover:border-[#7dd3c0]/30 hover:bg-[rgba(125,211,192,0.1)] transition-all duration-300 text-left flex items-center gap-3"
    >
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center flex-shrink-0`}>
        <span className="text-sm font-medium text-[#1e2026]">{user.initials}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#f5f3ed]">{user.name}</p>
        <p className="text-xs text-[#b8b5ad] truncate">{application.message}</p>
      </div>
      <div className="text-xs text-[#7dd3c0]">
        {application.appliedAt?.toDate?.() ? new Date(application.appliedAt.toDate()).toLocaleDateString('pl-PL') : new Date().toLocaleDateString('pl-PL')}
      </div>
    </button>
  );
}

export default function MyListings() {
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [completedListings, setCompletedListings] = useState<Listing[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedListingForComplete, setSelectedListingForComplete] = useState<Listing | null>(null);
  const [applicationsForListing, setApplicationsForListing] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const refreshListings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const active = await getActiveListingsByUser(currentUser.id);
      const completed = await getCompletedListingsByUser(currentUser.id);
      setActiveListings(active);
      setCompletedListings(completed);
    } catch (error) {
      console.error('Failed to refresh listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshListings();
  }, [currentUser]);

  const handleDelete = async (listingId: string) => {
    try {
      await deleteListing(listingId);
      await refreshListings();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Nie udało się usunąć ogłoszenia');
    }
  };

  const handleOpenCompleteModal = async (listing: Listing) => {
    try {
      const apps = await getApplicationsForListing(listing.id);
      setApplicationsForListing(apps);
      setSelectedListingForComplete(listing);
      setShowCompleteConfirm(true);
    } catch (error) {
      console.error('Failed to load applications:', error);
      alert('Nie udało się załadować zgłoszeń');
    }
  };

  const handleCompleteWithUser = async (completedWithUserId: string) => {
    if (!selectedListingForComplete) return;
    
    try {
      const completed = await completeListing(selectedListingForComplete.id, completedWithUserId);
      if (completed) {
        await refreshListings();
        setShowCompleteConfirm(false);
        setSelectedListingForComplete(null);
        setApplicationsForListing([]);
        alert('✅ Ogłoszenie zostało zakończone! Punkty zostały przyznane.');
      } else {
        alert('❌ Nie można zakończyć tego ogłoszenia. Upewnij się, że wybrany użytkownik ma zaakceptowane zgłoszenie.');
      }
    } catch (error) {
      console.error('Failed to complete listing:', error);
      alert('Wystąpił błąd podczas kończenia ogłoszenia');
    }
  };

  const handleSelectType = (type: 'offer' | 'request') => {
    setShowTypeModal(false);
    if (type === 'offer') {
      navigate('/create-favor-request');
    } else {
      navigate('/create-help-request');
    }
  };

  const hasApplications = (): boolean => {
    // To jest używane tylko do wyświetlania ikony - nie pobieramy tutaj aplikacji
    return applicationsForListing.length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <div className="flex-1">
            <h1 className="font-medium text-[#f5f3ed]">Moje Ogłoszenia</h1>
            <p className="text-sm text-[#b8b5ad]">{activeListings.length} aktywne</p>
          </div>
          <button
            onClick={() => setShowTypeModal(true)}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-lg"
          >
            <Plus className="w-5 h-5 text-[#1e2026]" />
          </button>
        </header>

        {/* Modal wyboru typu */}
        {showTypeModal && (
          <div className="fixed inset-0 bg-[rgba(42,45,53,0.95)] backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#7dd3c0]/20 rounded-3xl p-6 w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-[#f5f3ed]">Wybierz typ</h2>
                <button onClick={() => setShowTypeModal(false)} className="w-10 h-10 rounded-xl bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-[#7dd3c0]" />
                </button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleSelectType('offer')}
                  className="w-full backdrop-blur-md bg-gradient-to-r from-[#7dd3c0]/15 to-[#a8d5ba]/10 border border-[#7dd3c0]/25 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center">
                    <HandHelping className="w-6 h-6 text-[#1e2026]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#f5f3ed]">Oferta</h3>
                    <p className="text-xs text-[#b8b5ad]">Udostępnij przedmiot</p>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectType('request')}
                  className="w-full backdrop-blur-md bg-gradient-to-r from-[#89cff0]/15 to-[#b8d8e8]/10 border border-[#89cff0]/25 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#89cff0] to-[#b8d8e8] flex items-center justify-center">
                    <ListTodo className="w-6 h-6 text-[#1e2026]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#f5f3ed]">Prośba</h3>
                    <p className="text-xs text-[#b8b5ad]">Poproś o pomoc</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active listings */}
        {activeListings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Aktywne</h3>
            <div className="space-y-4">
              {activeListings.map((item) => (
                <div
                  key={item.id}
                  className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-auto flex-shrink-0 relative">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-1 left-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        item.listingType === 'offer' 
                          ? 'bg-[#7dd3c0] text-[#1e2026]'
                          : 'bg-[#89cff0] text-[#1e2026]'
                      }`}>
                        {item.listingType === 'offer' ? 'O' : 'P'}
                      </span>
                    </div>
                    <div className="flex-1 py-3 pr-4">
                      <h4 className="font-medium text-[#f5f3ed] mb-1">{item.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#b8b5ad] mb-2">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#7dd3c0]"><Users className="w-3 h-3" /> {item.interestedCount}</span>
                      </div>
                      {item.suggestedPoints && (
                        <div className="text-xs text-[#89cff0] mb-2">
                          🎯 {item.suggestedPoints} pkt.
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenCompleteModal(item)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] text-xs font-medium flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Zakończ
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-[rgba(232,141,141,0.2)] border border-[#e88d8d]/40 text-[#e88d8d] text-xs font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Usuń
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed listings */}
        {completedListings.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Zakończone</h3>
            <div className="space-y-4">
              {completedListings.map((item) => (
                <CompletedListingItem key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}

        {activeListings.length === 0 && completedListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#b8b5ad]">Nie masz jeszcze żadnych ogłoszeń</p>
            <button
              onClick={() => setShowTypeModal(true)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-2xl"
            >
              Dodaj pierwsze ogłoszenie
            </button>
          </div>
        )}
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(42,45,53,0.95)] backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#e88d8d]/30 rounded-3xl p-6 w-full shadow-2xl">
            <h2 className="text-lg font-medium text-[#f5f3ed] mb-3">Usuń ogłoszenie?</h2>
            <p className="text-sm text-[#b8b5ad] mb-6">Tej akcji nie można cofnąć.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-3 rounded-xl bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed]">Anuluj</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#e88d8d] to-[#c96b6b] text-white font-medium">Usuń</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal potwierdzenia zakończenia z wyborem użytkownika */}
      {showCompleteConfirm && selectedListingForComplete && (
        <div className="fixed inset-0 bg-[rgba(42,45,53,0.95)] backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#7dd3c0]/30 rounded-3xl p-6 w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#f5f3ed]">Zakończ ogłoszenie</h2>
              <button 
                onClick={() => {
                  setShowCompleteConfirm(false);
                  setSelectedListingForComplete(null);
                  setApplicationsForListing([]);
                }}
                className="w-8 h-8 rounded-full bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center"
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
                <button
                  onClick={() => {
                    setShowCompleteConfirm(false);
                    setSelectedListingForComplete(null);
                    setApplicationsForListing([]);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] text-sm"
                >
                  Zamknij
                </button>
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {applicationsForListing.map((app) => (
                  <ApplicationItem 
                    key={app.userId} 
                    application={app} 
                    onComplete={handleCompleteWithUser}
                    onClose={() => {
                      setShowCompleteConfirm(false);
                      setSelectedListingForComplete(null);
                      setApplicationsForListing([]);
                    }}
                  />
                ))}
              </div>
            )}

            {applicationsForListing.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCompleteConfirm(false);
                    setSelectedListingForComplete(null);
                    setApplicationsForListing([]);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed]"
                >
                  Anuluj
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}