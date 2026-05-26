import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Leaf, Mail, User, LogOut } from 'lucide-react';
import { signOutUser, getCurrentUser } from '../../data/firebaseData';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

const navItems = [
  { icon: Home,    label: 'Home',             path: '/dashboard' },
  { icon: Package, label: 'Prośby',           path: '/request-help' },
  { icon: Leaf,    label: 'Pomóc innym',       path: '/request-favor' },
  { icon: Mail,    label: 'Wiadomości',       path: '/messages' },
  { icon: Package, label: 'Moje Ogłoszenia', path: '/my-listings' },
  { icon: User,    label: 'Profil',           path: '/profile' },
];

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    // Możesz dodać nasłuchiwanie zmian użytkownika
    const interval = setInterval(() => {
      setCurrentUser(getCurrentUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    navigate('/onboarding');
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 backdrop-blur-xl bg-gradient-to-b from-[rgba(60,65,75,0.6)] to-[rgba(50,55,65,0.4)] border-r border-[#7dd3c0]/15 flex-col shadow-2xl z-50">
      {/* Logo - bez zmian */}
      <Logo classes="p-6" />

      {/* Navigation - bez zmian */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#7dd3c0]/20 to-[#a8d5ba]/10 border border-[#7dd3c0]/30 shadow-lg shadow-[#7dd3c0]/10'
                  : 'hover:bg-[rgba(60,65,75,0.5)] border border-transparent hover:border-[#7dd3c0]/20'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] shadow-lg'
                    : 'bg-[rgba(125,211,192,0.1)] group-hover:bg-[rgba(125,211,192,0.2)]'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-[#1e2026]' : 'text-[#7dd3c0]'}`}
                />
              </div>
              <span
                className={`font-medium ${
                  isActive ? 'text-[#f5f3ed]' : 'text-[#b8b5ad] group-hover:text-[#f5f3ed]'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#7dd3c0] to-[#a8d5ba] rounded-l-full shadow-lg shadow-[#7dd3c0]/50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#7dd3c0]/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[rgba(232,141,141,0.1)] border border-transparent hover:border-[#e88d8d]/30 transition-all duration-300 group"
        >
          <div className="w-11 h-11 rounded-xl bg-[rgba(232,141,141,0.1)] flex items-center justify-center group-hover:bg-[rgba(232,141,141,0.15)]">
            <LogOut className="w-5 h-5 text-[#e88d8d]" />
          </div>
          <span className="font-medium text-[#e88d8d]">Wyloguj się</span>
        </button>
      </div>
    </aside>
  );
}