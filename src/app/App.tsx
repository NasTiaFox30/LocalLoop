import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { syncCurrentUser, isLoggedIn, setPointsNotificationCallback} from '../data/appData';
import { PointsProvider, usePoints } from '../contexts/PointsContext';
import { PointsNotification } from './components/PointsNotification';

// Layouts
import DesktopSidebar from './components/DesktopSidebar';
import MobileBottomNav from './components/MobileBottomNav';

// Pages / screens
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import DesktopDashboard from './components/DesktopDashboard';
import Dashboard from './components/Dashboard';
import DesktopRequestFavor from './components/DesktopRequestFavor';
import RequestFavor from './components/RequestFavor';
import DesktopRequestHelp from './components/DesktopRequestHelp';
import RequestHelp from './components/RequestHelp';
import DesktopMessages from './components/DesktopMessages';
import MessagesInbox from './components/MessagesInbox';
import DesktopUserProfile from './components/DesktopUserProfile';
import UserProfile from './components/UserProfile';
import DesktopMyListings from './components/DesktopMyListings';
import MyListings from './components/MyListings';
import DesktopEditProfile from './components/DesktopEditProfile';
import EditProfile from './components/EditProfile';
import DesktopDetailDrawer from './components/DesktopDetailDrawer';
import DetailDrawer from './components/DetailDrawer';
import SmartChat from './components/SmartChat';
import DesktopCreateHelpRequest from './components/DesktopCreateHelpRequest';
import DesktopCreateFavorRequest from './components/DesktopCreateFavorRequest';
import CreateFavorRequest from './components/CreateFavorRequest';
import CreateHelpRequest from './components/CreateHelpRequest';
import { ConversationsProvider} from '../contexts/ConversationsContext';

// Routes that show the main app chrome (sidebar + bottom nav)
const APP_ROUTES = [
  '/dashboard',
  '/request',
  '/request-help',
  '/listing',
  '/messages',
  '/profile',
  '/my-listings',
  '/edit-profile',
  '/listing-detail',
];

/** Adaptive page wrapper: desktop shows Desktop* variant, mobile shows mobile variant */
function AdaptivePage({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <>
      <div className="block lg:hidden">{mobile}</div>
      <div className="hidden lg:block">{desktop}</div>
    </>
  );
}

// Logika powiadomień
function PointsNotificationManager() {
  const { showPointsEarned } = usePoints();
  
  useEffect(() => {
    setPointsNotificationCallback(showPointsEarned);
    return () => setPointsNotificationCallback(null);
  }, [showPointsEarned]);
  
  return null; // Ten komponent nie renderuje niczego wizualnego
}


// Wyświetlanie powiadomień
function PointsNotificationContainer() {
  const { notifications, removeNotification } = usePoints();
  return <PointsNotification notifications={notifications} onRemove={removeNotification} />;
}

export default function App() {
  const location = useLocation();
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const isAuthScreen =
    location.pathname === '/' ||
    location.pathname === '/onboarding' ||
    location.pathname === '/auth';

  const isAppRoute = APP_ROUTES.some((r) => location.pathname.startsWith(r));
  const isUserLoggedIn = isLoggedIn();

  useEffect(() => {
    syncCurrentUser();
    
    const handleUserChange = () => {
      syncCurrentUser();
      window.location.reload();
    };
    
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);
  
  if (!isAuthScreen && !isUserLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  if ((location.pathname === '/auth' || location.pathname === '/onboarding') && isUserLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleOpenDetail = (item: any) => {
    setSelectedItem(item);
    setIsDetailDrawerOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailDrawerOpen(false);
  };

  return (
    <ConversationsProvider>
    <PointsProvider>
      <PointsNotificationManager />
    <div className="size-full min-h-screen bg-[#2a2d35]">
      {/* Desktop sidebar – only visible on app routes */}
      {isAppRoute && <DesktopSidebar />}

      {/* Main content area – offset from sidebar on desktop */}
      <div className={isAppRoute ? 'lg:pl-72' : ''}>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />

          {/* ── App routes ── */}
          <Route
            path="/dashboard"
            element={
              <AdaptivePage
                mobile={<Dashboard />}
                desktop={<DesktopDashboard onOpenDetail={handleOpenDetail} />}
              />
            }
          />
          <Route
            path="/request-favor"
            element={
              <AdaptivePage
                mobile={<RequestFavor />}
                desktop={<DesktopRequestFavor onOpenDetail={handleOpenDetail} />}
              />
            }
          />
          <Route
            path="/request-help"
            element={
              <AdaptivePage
                mobile={<RequestHelp />}
                desktop={<DesktopRequestHelp onOpenDetail={handleOpenDetail} />}
              />
            }
          />
          <Route
            path="/create-help-request"
            element={
              <AdaptivePage
                mobile={<CreateHelpRequest />}
                desktop={<DesktopCreateHelpRequest />}
              />
            }
          />
          <Route
            path="/create-favor-request"
            element={
              <AdaptivePage
                mobile={<CreateFavorRequest />}
                desktop={<DesktopCreateFavorRequest />}
              />
            }
          />
          <Route
            path="/messages"
            element={
              <AdaptivePage
                mobile={<MessagesInbox />}
                desktop={<DesktopMessages />}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <AdaptivePage
                mobile={<UserProfile />}
                desktop={<DesktopUserProfile />}
              />
            }
          />
          <Route
            path="/my-listings"
            element={
              <AdaptivePage
                mobile={<MyListings />}
                desktop={<DesktopMyListings/>}
              />
            }
          />
          <Route
            path="/edit-profile"
            element={
              <AdaptivePage
                mobile={<EditProfile />}
                desktop={<DesktopEditProfile />}
              />
            }
          />
          <Route
            path="/listing-detail"
            element={<DetailDrawer />}
          />
          <Route 
            path="/chat" 
            element={<SmartChat />}
          />
          <Route 
            path="/messages/chat" 
            element={<SmartChat />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>

        {/* Mobile bottom nav – only on app routes, hidden on desktop */}
        {isAppRoute && (
          <div className="lg:hidden">
            <MobileBottomNav />
          </div>
        )}
      </div>

      {/* Detail drawer (desktop) */}
      <DesktopDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetail}
        onChat={() => {
          setIsDetailDrawerOpen(false);
        }}
        item={selectedItem}
      />
      <PointsNotificationContainer />
    </div>
    </PointsProvider>
    </ConversationsProvider>
  );
}