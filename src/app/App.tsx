import { useState } from 'react';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import RequestFavor from './components/RequestFavor';
import RequestHelp from './components/RequestHelp';
import ListingCreator from './components/ListingCreator';
import ListingDetail from './components/ListingDetail';
import SmartChat from './components/SmartChat';
import MessagesInbox from './components/MessagesInbox';
import UserProfile from './components/UserProfile';
import MyListings from './components/MyListings';
import EditProfile from './components/EditProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('onboarding');

  return (
    <div className="size-full">
      {currentScreen === 'onboarding' && <Onboarding onNavigate={setCurrentScreen} />}
      {currentScreen === 'auth' && <Auth onNavigate={setCurrentScreen} />}
      {currentScreen === 'dashboard' && <Dashboard onNavigate={setCurrentScreen} />}
      {currentScreen === 'request' && <RequestFavor onNavigate={setCurrentScreen} />}
      {currentScreen === 'request-help' && <RequestHelp onNavigate={setCurrentScreen} />}
      {currentScreen === 'listing' && <ListingCreator onNavigate={setCurrentScreen} />}
      {currentScreen === 'listing-detail' && <ListingDetail onNavigate={setCurrentScreen} />}
      {currentScreen === 'chat' && <SmartChat onNavigate={setCurrentScreen} />}
      {currentScreen === 'messages' && <MessagesInbox onNavigate={setCurrentScreen} />}
      {currentScreen === 'profile' && <UserProfile onNavigate={setCurrentScreen} />}
      {currentScreen === 'my-listings' && <MyListings onNavigate={setCurrentScreen} />}
      {currentScreen === 'edit-profile' && <EditProfile onNavigate={setCurrentScreen} />}
    </div>
  );
}