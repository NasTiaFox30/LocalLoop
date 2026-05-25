import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, UserPlus, CheckCircle, XCircle, Users, Check, X } from 'lucide-react';
import { 
  currentUser, 
  getUserById, 
  getListingById, 
  addApplication,
  getApplicationStatus,
  getApplicationsForListing,
  updateApplicationStatus,
  type Application 
} from '../../data/appData';
import { useConversations } from '../../contexts/ConversationsContext';

export default function SmartChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addConversation, addMessage, getMessagesForConversation, conversations } = useConversations();
  const [inputValue, setInputValue] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'accepted' | 'rejected' | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showApplicationsPanel, setShowApplicationsPanel] = useState(false);
  const [processingApp, setProcessingApp] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = location.state?.conversationId;
  const listingId = location.state?.listingId;
  const ownerId = location.state?.ownerId;

  // Zabezpieczenie: jeśli ownerId to aktualny użytkownik, przekieruj
  useEffect(() => {
    if (ownerId && ownerId === currentUser.id) {
      // Nie można czatować samemu ze sobą
      navigate('/messages', { replace: true });
    }
  }, [ownerId, navigate]);

  // Отримуємо розмову напряму з контексту на основі пропсів
  const conversation = conversationId 
    ? conversations.find(c => c.id === conversationId)
    : (listingId && ownerId 
        ? conversations.find(c => c.listingId === listingId && c.participants.includes(ownerId))
        : null);

  // Якщо listingId немає в state (перехід з інбоксу), беремо його з самої розмови
  const listing = listingId 
    ? getListingById(listingId) 
    : (conversation ? getListingById(conversation.listingId) : null);

  const otherUser = conversation
    ? getUserById(conversation.participants.find(p => p !== currentUser.id)!)
    : (ownerId ? getUserById(ownerId) : null);

  // Sprawdzenie czy to rozmowa z samym sobą
  const isSelfChat = otherUser?.id === currentUser.id;
  
  // Sprawdzenie czy aktualny użytkownik jest właścicielem ogłoszenia
  const isOwner = listing?.ownerId === currentUser.id;

  // Sprawdź status zgłoszenia dla tego ogłoszenia (dla osoby zgłaszającej)
  useEffect(() => {
    if (listing && !isOwner && listing.status === 'active') {
      const status = getApplicationStatus(listing.id, currentUser.id);
      setApplicationStatus(status);
    } else {
      setApplicationStatus(null);
    }
  }, [listing, isOwner]);

  // Pobierz wszystkie zgłoszenia dla ogłoszenia (dla właściciela)
  useEffect(() => {
    if (listing && isOwner && listing.status === 'active') {
      const apps = getApplicationsForListing(listing.id);
      setApplications(apps);
    } else {
      setApplications([]);
    }
  }, [listing, isOwner]);

  // Tworzymy nową rozmowę tylko wtedy, gdy jej rzeczywiście nie ma
  useEffect(() => {
    if (!conversation && listing && otherUser && !isSelfChat) {
      addConversation(listing.id, otherUser.id);
    }
  }, [conversation, listing, otherUser, addConversation, isSelfChat]);

  const messages = conversation ? getMessagesForConversation(conversation.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const icebreakers = [
    "Hej, mogę w zamian przynieść domową kawę! ☕",
    "Cześć! Kiedy pasuje Ci odbiór?",
    "Chętnie pomogę w ogrodzie w zamian 🌱",
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !conversation || isSelfChat) return;
    addMessage(conversation.id, text);
    setInputValue('');
  };

  const handleApply = async () => {
    if (!listing || !otherUser || isOwner || listing.status !== 'active') return;
    
    setIsApplying(true);
    
    const defaultMessage = `Chcę pomóc przy "${listing.title}". ${listing.listingType === 'offer' ? 'Chciałbym/chciałabym skorzystać z tej oferty.' : 'Chciałbym/chciałabym pomóc.'}`;
    
    const application = addApplication(listing.id, currentUser.id, defaultMessage);
    
    if (application && conversation) {
      setApplicationStatus('pending');
      addMessage(conversation.id, `📋 Zgłosiłem/am się przy tym ogłoszeniu. Oczekuję na decyzję właściciela.`);
    }
    
    setIsApplying(false);
  };

  const handleAcceptApplication = async (applicationUserId: string) => {
    if (!listing) return;
    setProcessingApp(applicationUserId);
    
    const updated = updateApplicationStatus(listing.id, applicationUserId, 'accepted');
    
    if (updated && conversation) {
      const applicant = getUserById(applicationUserId);
      addMessage(conversation.id, `✅ Zaakceptowałem/am zgłoszenie od ${applicant?.name}. Zakończ ogłoszenie w panelu "Moje Ogłoszenia" aby przyznać punkty.`);
      
      // Odśwież listę zgłoszeń
      const refreshedApps = getApplicationsForListing(listing.id);
      setApplications(refreshedApps);
      
      // Dodatkowo: odśwież dane ogłoszenia (może status się zmienił)
      const refreshedListing = getListingById(listing.id);
      if (refreshedListing) {
        // Możesz zaktualizować local state listing jeśli go przechowujesz
      }
    }
    
    setProcessingApp(null);
  };

  const handleRejectApplication = async (applicationUserId: string) => {
    if (!listing) return;
    setProcessingApp(applicationUserId);
    
    const updated = updateApplicationStatus(listing.id, applicationUserId, 'rejected');
    
    if (updated && conversation) {
      const applicant = getUserById(applicationUserId);
      addMessage(conversation.id, `❌ Odrzuciłem/am zgłoszenie od ${applicant?.name}.`);
      setApplications(getApplicationsForListing(listing.id));
    }
    
    setProcessingApp(null);
  };

  // Jeśli to rozmowa z samym sobą, pokaż komunikat
  if (isSelfChat) {
    return (
      <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7dd3c0]/20 to-[#a8d5ba]/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-[#7dd3c0]" />
          </div>
          <h3 className="text-xl font-medium text-[#f5f3ed] mb-2">Nie możesz czatować sam ze sobą</h3>
          <p className="text-sm text-[#b8b5ad]">To jest Twoje własne ogłoszenie.</p>
          <button
            onClick={() => navigate('/messages')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium rounded-2xl"
          >
            Wróć do wiadomości
          </button>
        </div>
      </div>
    );
  }

  if (!otherUser || !listing) {
    return (
      <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex items-center justify-center">
        <p>Nie znaleziono konwersacji</p>
      </div>
    );
  }

  const showApplyButton = !isOwner && 
                          listing.status === 'active' && 
                          applicationStatus === null;

  const showPendingStatus = applicationStatus === 'pending';
  const showAcceptedStatus = applicationStatus === 'accepted';
  const showRejectedStatus = applicationStatus === 'rejected';

  const pendingApplications = applications.filter(a => a.status === 'pending');
  const hasPendingApplications = pendingApplications.length > 0;

  // Komponent zastępczy dla Clock
  const ClockIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <header className="flex items-center gap-3 p-4 border-b border-[#7dd3c0]/15 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.6)] to-[rgba(50,55,65,0.4)]">
          <button
            onClick={() => navigate('/messages')}
            className="w-11 h-11 rounded-2xl backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div className="flex-1">
            <h2 className="font-medium text-[#f5f3ed]">{otherUser.name}</h2>
            <p className="text-xs text-[#b8b5ad]">{otherUser.neighborhood}</p>
            <p className="text-xs text-[#7dd3c0] mt-0.5">Dot. {listing.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center shadow-lg border-2 border-[#7dd3c0]/30`}>
              <span className="text-sm font-medium text-[#1e2026]">{otherUser.initials}</span>
            </div>
            {/* Przycisk do panelu zgłoszeń (tylko dla właściciela) */}
            {isOwner && listing.status === 'active' && (
              <button
                onClick={() => setShowApplicationsPanel(!showApplicationsPanel)}
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  showApplicationsPanel 
                    ? 'bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]' 
                    : 'backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#7dd3c0] hover:border-[#7dd3c0]/40'
                }`}
              >
                <Users className="w-5 h-5" />
                {hasPendingApplications && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#e88d8d] to-[#c96b6b] text-white text-xs flex items-center justify-center border-2 border-[#2a2d35]">
                    {pendingApplications.length}
                  </div>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Panel zgłoszeń (dla właściciela) */}
        {showApplicationsPanel && isOwner && listing.status === 'active' && (
          <div className="border-b border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(125,211,192,0.05)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#f5f3ed] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7dd3c0]" />
                Zgłoszenia ({applications.length})
              </h3>
              <button
                onClick={() => setShowApplicationsPanel(false)}
                className="text-xs text-[#b8b5ad] hover:text-[#7dd3c0]"
              >
                Zamknij
              </button>
            </div>
            
            {applications.length === 0 ? (
              <p className="text-sm text-[#b8b5ad] text-center py-4">
                Brak zgłoszeń. Poinformuj sąsiadów w czacie, żeby się zgłosili!
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {applications.map((app) => {
                  const applicant = getUserById(app.userId);
                  if (!applicant) return null;
                  
                  return (
                    <div
                      key={app.userId}
                      className={`backdrop-blur-sm rounded-xl p-3 ${
                        app.status === 'pending'
                          ? 'bg-[rgba(125,211,192,0.1)] border border-[#7dd3c0]/30'
                          : app.status === 'accepted'
                          ? 'bg-[rgba(125,211,192,0.05)] border border-[#7dd3c0]/20 opacity-70'
                          : 'bg-[rgba(232,141,141,0.05)] border border-[#e88d8d]/20 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${applicant.avatarColor} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm font-medium text-[#1e2026]">{applicant.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#f5f3ed]">{applicant.name}</p>
                          <p className="text-xs text-[#b8b5ad] truncate">{app.message}</p>
                          <p className="text-xs text-[#7dd3c0] mt-0.5">
                            {new Date(app.appliedAt).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                        
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptApplication(app.userId)}
                              disabled={processingApp === app.userId}
                              className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center hover:scale-110 transition-all duration-300 disabled:opacity-50"
                              title="Zaakceptuj"
                            >
                              {processingApp === app.userId ? (
                                <div className="w-4 h-4 border-2 border-[#1e2026] border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4 text-[#1e2026]" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectApplication(app.userId)}
                              disabled={processingApp === app.userId}
                              className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#e88d8d] to-[#c96b6b] flex items-center justify-center hover:scale-110 transition-all duration-300 disabled:opacity-50"
                              title="Odrzuć"
                            >
                              {processingApp === app.userId ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </button>
                          </div>
                        )}
                        
                        {app.status === 'accepted' && (
                          <div className="flex items-center gap-1 text-xs text-[#7dd3c0]">
                            <CheckCircle className="w-4 h-4" />
                            <span>Zaakceptowano</span>
                          </div>
                        )}
                        
                        {app.status === 'rejected' && (
                          <div className="flex items-center gap-1 text-xs text-[#e88d8d]">
                            <XCircle className="w-4 h-4" />
                            <span>Odrzucono</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-[#2a2d35] via-[#2a2d35] to-[#25292f]">
          {/* Status zgłoszenia (dla zgłaszającego) */}
          {!isOwner && showPendingStatus && (
            <div className="flex justify-center">
              <div className="backdrop-blur-md bg-[rgba(125,211,192,0.15)] border border-[#7dd3c0]/30 rounded-xl px-3 py-2 flex items-center gap-2">
                <ClockIcon />
                <span className="text-xs text-[#7dd3c0]">Zgłoszono – oczekiwanie na decyzję</span>
              </div>
            </div>
          )}
          
          {!isOwner && showAcceptedStatus && (
            <div className="flex justify-center">
              <div className="backdrop-blur-md bg-[rgba(125,211,192,0.15)] border border-[#7dd3c0]/30 rounded-xl px-3 py-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7dd3c0]" />
                <span className="text-xs text-[#7dd3c0]">✓ Zgłoszenie zostało zaakceptowane!</span>
              </div>
            </div>
          )}
          
          {!isOwner && showRejectedStatus && (
            <div className="flex justify-center">
              <div className="backdrop-blur-md bg-[rgba(232,141,141,0.15)] border border-[#e88d8d]/30 rounded-xl px-3 py-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#e88d8d]" />
                <span className="text-xs text-[#e88d8d]">✗ Zgłoszenie zostało odrzucone</span>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7dd3c0]/20 to-[#a8d5ba]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-[#7dd3c0]" />
              </div>
              <h3 className="text-lg font-medium text-[#f5f3ed] mb-2">
                Rozpocznij rozmowę z {otherUser.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-[#b8b5ad] max-w-md">
                Napisz wiadomość, aby omówić szczegóły dotyczące "{listing.title}"
              </p>
            </div>
          )}
          {messages.map((msg) => {
            const isFromMe = msg.fromUserId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-[1.25rem] px-5 py-3 shadow-lg ${
                  isFromMe
                    ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]'
                    : 'backdrop-blur-md bg-[rgba(245,243,237,0.95)] text-[#2a2d35] border border-[#7dd3c0]/10'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isFromMe ? 'text-[#1e2026]/60' : 'text-[#2a2d35]/50'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#7dd3c0]/15 backdrop-blur-md bg-gradient-to-r from-[rgba(60,65,75,0.6)] to-[rgba(50,55,65,0.4)]">
          {/* Przycisk "Zgłoś się!" (tylko dla osób NIE będących właścicielami) */}
          {!isOwner && showApplyButton && (
            <div className="mb-4">
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#89cff0] to-[#7dd3c0] text-[#1e2026] font-medium flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1e2026] border-t-transparent rounded-full animate-spin" />
                    Zgłaszanie...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Zgłoś się!
                  </>
                )}
              </button>
              <p className="text-xs text-[#b8b5ad] text-center mt-2">
                Zgłoś się – właściciel będzie mógł Cię wybrać
              </p>
            </div>
          )}

          {/* Informacja dla właściciela o panelu zgłoszeń */}
          {isOwner && listing.status === 'active' && hasPendingApplications && !showApplicationsPanel && (
            <div className="mb-4">
              <button
                onClick={() => setShowApplicationsPanel(true)}
                className="w-full py-2 rounded-xl backdrop-blur-md bg-[rgba(125,211,192,0.1)] border border-[#7dd3c0]/30 text-[#7dd3c0] text-sm flex items-center justify-center gap-2 hover:bg-[rgba(125,211,192,0.2)] transition-all duration-300"
              >
                <Users className="w-4 h-4" />
                {pendingApplications.length} nowe zgłoszenie{ pendingApplications.length !== 1 ? 'nia' : '' } – kliknij aby zarządzać
              </button>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#1e2026]" />
              </div>
              <span className="text-xs text-[#b8b5ad] font-medium">AI Lodołamacze</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {icebreakers.map((ice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(ice)}
                  className="flex-shrink-0 px-4 py-2.5 backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#89cff0]/10 border border-[#7dd3c0]/30 rounded-full text-xs text-[#f5f3ed] hover:bg-[#7dd3c0]/20 hover:border-[#7dd3c0]/50 hover:shadow-lg hover:shadow-[#7dd3c0]/20 transition-all duration-300"
                >
                  {ice}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder={isSelfChat ? "Nie możesz pisać do siebie" : "Napisz wiadomość..."}
              disabled={isSelfChat}
              className="flex-1 backdrop-blur-sm bg-[rgba(40,43,50,0.5)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-3.5 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isSelfChat || !inputValue.trim()}
              className="w-14 h-14 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-lg shadow-[#7dd3c0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-[#1e2026]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
