import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Sparkles, UserPlus, CheckCircle, XCircle, Users, Check, X } from 'lucide-react';
import { 
  getCurrentUser, 
  getUserById, 
  getListingById, 
  addApplication,
  getApplicationStatus,
  getApplicationsForListing,
  updateApplicationStatus,
  subscribeToMessages,
  type Application,
  type User,
  type Listing,
  type ChatMessage
} from '../../data/firebaseData';
import { useConversations } from '../../contexts/ConversationsContext';

interface DesktopSmartChatProps {
  conversationId?: string;
}

export default function DesktopSmartChat({ conversationId }: DesktopSmartChatProps) {
  const { conversations, addMessage, markAsRead } = useConversations();
  const [inputValue, setInputValue] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'accepted' | 'rejected' | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showApplicationsPanel, setShowApplicationsPanel] = useState(false);
  const [processingApp, setProcessingApp] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [listing, setListing] = useState<Listing | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Znajdź aktualną konwersację
  const currentConversation = conversationId 
    ? conversations.find(c => c.id === conversationId) 
    : null;

  // Subskrypcja wiadomości w czasie rzeczywistym
  useEffect(() => {
    if (!currentConversation) {
      setLiveMessages([]);
      return;
    }
    
    const unsubscribe = subscribeToMessages(currentConversation.id, (messages) => {
      setLiveMessages(messages);
    });
    
    return () => unsubscribe();
  }, [currentConversation?.id]); // ← używamy tylko ID

  // Użyj liveMessages jako źródła wiadomości
  const messages = liveMessages;

  // Oznacz jako przeczytane gdy konwersacja jest otwarta (BEZ messages w zależnościach!)
  useEffect(() => {
    if (currentConversation && currentUser && !isInitialMount.current) {
      markAsRead(currentConversation.id);
    }
    isInitialMount.current = false;
  }, [currentConversation?.id, currentUser, markAsRead]);

  // Załaduj dane ogłoszenia i drugiego użytkownika (tylko przy zmianie konwersacji)
  useEffect(() => {
    const loadData = async () => {
      if (!currentConversation || !currentUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const otherUserId = currentConversation.participants.find(p => p !== currentUser.id);
        if (otherUserId) {
          const userData = await getUserById(otherUserId);
          setOtherUser(userData);
        }
        
        const listingData = await getListingById(currentConversation.listingId);
        setListing(listingData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentConversation?.id, currentUser]); // ← tylko ID

  // Sprawdź status zgłoszenia
  useEffect(() => {
    const checkStatus = async () => {
      if (listing && listing.ownerId !== currentUser?.id && listing.status === 'active' && currentUser) {
        const status = await getApplicationStatus(listing.id, currentUser.id);
        setApplicationStatus(status);
      } else {
        setApplicationStatus(null);
      }
    };
    checkStatus();
  }, [listing?.id, currentUser]); // ← tylko ID listingu

  // Pobierz zgłoszenia
  useEffect(() => {
    const loadApplications = async () => {
      if (listing && listing.ownerId === currentUser?.id && listing.status === 'active') {
        const apps = await getApplicationsForListing(listing.id);
        setApplications(apps);
      } else {
        setApplications([]);
      }
    };
    loadApplications();
  }, [listing?.id, currentUser]); // ← tylko ID listingu

  // Auto-scroll do najnowszej wiadomości (bez ponownego uruchamiania efektów)
  useEffect(() => {
    if (!isInitialMount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const icebreakers = [
    "Hej, mogę w zamian przynieść domową kawę! ☕",
    "Cześć! Kiedy pasuje Ci odbiór?",
    "Chętnie pomogę w ogrodzie w zamian 🌱",
  ];

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !currentConversation || !currentUser) return;
    await addMessage(currentConversation.id, text);
    setInputValue('');
  }, [currentConversation, currentUser, addMessage]);

  const handleApply = useCallback(async () => {
    if (!listing || !otherUser || listing.ownerId === currentUser?.id || listing.status !== 'active' || !currentUser) return;
    
    setIsApplying(true);
    
    const defaultMessage = `Chcę pomóc przy "${listing.title}". ${listing.listingType === 'offer' ? 'Chciałbym/chciałabym skorzystać z tej oferty.' : 'Chciałbym/chciałabym pomóc.'}`;
    
    const application = await addApplication(listing.id, defaultMessage);
    
    if (application && currentConversation) {
      setApplicationStatus('pending');
      await addMessage(currentConversation.id, `📋 Zgłosiłem/am się przy tym ogłoszeniu. Oczekuję na decyzję właściciela.`);
    }
    
    setIsApplying(false);
  }, [listing, otherUser, currentUser, currentConversation, addMessage]);

  // ... reszta komponentu bez zmian (handleAcceptApplication, handleRejectApplication, JSX)
  const handleAcceptApplication = useCallback(async (applicationUserId: string) => {
    if (!listing) return;
    setProcessingApp(applicationUserId);
    
    const updated = await updateApplicationStatus(listing.id, applicationUserId, 'accepted');
    
    if (updated && currentConversation) {
      const applicant = await getUserById(applicationUserId);
      await addMessage(currentConversation.id, `✅ Zaakceptowałem/am zgłoszenie od ${applicant?.name}. Zakończ ogłoszenie w panelu "Moje Ogłoszenia" aby przyznać punkty.`);
      const refreshedApps = await getApplicationsForListing(listing.id);
      setApplications(refreshedApps);
    }
    
    setProcessingApp(null);
  }, [listing, currentConversation, addMessage]);

  const handleRejectApplication = useCallback(async (applicationUserId: string) => {
    if (!listing) return;
    setProcessingApp(applicationUserId);
    
    const updated = await updateApplicationStatus(listing.id, applicationUserId, 'rejected');
    
    if (updated && currentConversation) {
      const applicant = await getUserById(applicationUserId);
      await addMessage(currentConversation.id, `❌ Odrzuciłem/am zgłoszenie od ${applicant?.name}.`);
      const refreshedApps = await getApplicationsForListing(listing.id);
      setApplications(refreshedApps);
    }
    
    setProcessingApp(null);
  }, [listing, currentConversation, addMessage]);

  // Reszta JSX bez zmian (zwracany komponent)
  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-[#7dd3c0] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-[#f5f3ed] mb-2">Wybierz rozmowę</h3>
          <p className="text-sm text-[#b8b5ad]">Kliknij na konwersację z lewej, aby rozpocząć czat</p>
        </div>
      </div>
    );
  }

  if (loading || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-[#7dd3c0] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-[#f5f3ed] mb-2">Konwersacja nie znaleziona</h3>
          <p className="text-sm text-[#b8b5ad]">Wybierz inną rozmowę z listy</p>
        </div>
      </div>
    );
  }

  if (!otherUser || !listing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner = listing.ownerId === currentUser.id;
  const showApplyButton = !isOwner && listing.status === 'active' && applicationStatus === null;
  const showPendingStatus = applicationStatus === 'pending';
  const showAcceptedStatus = applicationStatus === 'accepted';
  const showRejectedStatus = applicationStatus === 'rejected';
  const pendingApplications = applications.filter(a => a.status === 'pending');
  const hasPendingApplications = pendingApplications.length > 0;

  const ClockIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header - bez zmian */}
      <div className="border-b border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)] p-6">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center shadow-lg`}>
            <span className="text-lg font-medium text-[#1e2026]">{otherUser.initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-lg text-[#f5f3ed]">{otherUser.name}</h2>
            <p className="text-sm text-[#b8b5ad]">{otherUser.neighborhood}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs text-[#b8b5ad]">Aktywny/a</p>
              <span className="text-xs text-[#b8b5ad]">•</span>
              <div className="text-xs text-[#7dd3c0] hover:underline">
                ogłoszenie: {listing.title}
              </div>
            </div>
          </div>
          {isOwner && listing.status === 'active' && (
            <button
              onClick={() => setShowApplicationsPanel(!showApplicationsPanel)}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
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
      </div>

      {/* Panel zgłoszeń - bez zmian */}
      {showApplicationsPanel && isOwner && listing.status === 'active' && (
        <div className="border-b border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(125,211,192,0.05)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#f5f3ed] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7dd3c0]" />
              Zgłoszenia ({applications.length})
            </h3>
            <button onClick={() => setShowApplicationsPanel(false)} className="text-xs text-[#b8b5ad] hover:text-[#7dd3c0]">
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

                return (
                  <div
                    key={app.userId}
                    className={`backdrop-blur-sm rounded-xl p-3 flex items-center justify-between ${
                      app.status === 'pending'
                        ? 'bg-[rgba(125,211,192,0.1)] border border-[#7dd3c0]/30'
                        : app.status === 'accepted'
                        ? 'bg-[rgba(125,211,192,0.05)] border border-[#7dd3c0]/20 opacity-70'
                        : 'bg-[rgba(232,141,141,0.05)] border border-[#e88d8d]/20 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${app.userAvatarColor} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-sm font-medium text-[#1e2026]">{app.userInitials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#f5f3ed]">{app.userName}</p>
                        <p className="text-xs text-[#b8b5ad] truncate">{app.message}</p>
                        <p className="text-xs text-[#7dd3c0] mt-0.5">
                          {app.appliedAt?.toDate?.() ? new Date(app.appliedAt.toDate()).toLocaleDateString('pl-PL') : new Date().toLocaleDateString('pl-PL')}
                        </p>
                      </div>
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
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-[#2a2d35] via-[#2a2d35] to-[#25292f]">
        {!isOwner && showPendingStatus && (
          <div className="flex justify-center">
            <div className="backdrop-blur-md bg-[rgba(125,211,192,0.15)] border border-[#7dd3c0]/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <ClockIcon />
              <span className="text-xs text-[#7dd3c0]">Zgłoszono – oczekiwanie na decyzję właściciela</span>
            </div>
          </div>
        )}
        
        {!isOwner && showAcceptedStatus && (
          <div className="flex justify-center">
            <div className="backdrop-blur-md bg-[rgba(125,211,192,0.15)] border border-[#7dd3c0]/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#7dd3c0]" />
              <span className="text-xs text-[#7dd3c0]">✓ Zgłoszenie zostało zaakceptowane!</span>
            </div>
          </div>
        )}
        
        {!isOwner && showRejectedStatus && (
          <div className="flex justify-center">
            <div className="backdrop-blur-md bg-[rgba(232,141,141,0.15)] border border-[#e88d8d]/30 rounded-xl px-4 py-2 flex items-center gap-2">
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
          const isFromMe = msg.fromUserId === currentUser?.id;
          const messageDate = msg.timestamp?.toDate?.() || new Date(msg.timestamp as any);
          return (
            <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[70%] ${isFromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isFromMe && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${otherUser.avatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-xs font-medium text-[#1e2026]">{otherUser.initials}</span>
                  </div>
                )}
                <div
                  className={`rounded-[1.25rem] px-5 py-3 shadow-lg ${
                    isFromMe
                      ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]'
                      : 'backdrop-blur-md bg-[rgba(245,243,237,0.95)] text-[#2a2d35] border border-[#7dd3c0]/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isFromMe ? 'text-[#1e2026]/60' : 'text-[#2a2d35]/50'}`}>
                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-[#7dd3c0]/15 backdrop-blur-md bg-[rgba(40,43,50,0.3)]">
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
                className="flex-shrink-0 px-4 py-2.5 backdrop-blur-sm bg-gradient-to-r from-[#7dd3c0]/15 to-[#89cff0]/10 border border-[#7dd3c0]/30 rounded-full text-sm text-[#f5f3ed] hover:bg-[#7dd3c0]/20 hover:border-[#7dd3c0]/50 hover:scale-105 hover:shadow-lg hover:shadow-[#7dd3c0]/20 transition-all duration-300"
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
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder={`Napisz do ${otherUser.name.split(' ')[0]}...`}
            className="flex-1 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-5 py-4 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="w-14 h-14 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 group"
          >
            <Send className="w-5 h-5 text-[#1e2026] group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}