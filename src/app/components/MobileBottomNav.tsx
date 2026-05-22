import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Leaf, Mail, User } from 'lucide-react';

const mobileNavItems = [
  { icon: Home,    label: 'Home',        path: '/dashboard' },
  { icon: Package, label: 'Prośby',      path: '/request' },
  { icon: Leaf,    label: 'Udostępnij',  path: '/listing' },
  { icon: Mail,    label: 'Wiadomości',  path: '/messages' },
  { icon: User,    label: 'Profil',      path: '/profile' },
];

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-t from-[rgba(30,32,38,0.98)] to-[rgba(42,45,53,0.92)] border-t border-[#7dd3c0]/15 shadow-2xl">
      {/* Safe area for iOS */}
      <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 min-w-[3.5rem] py-1 px-2 rounded-2xl transition-all duration-200 active:scale-95"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] shadow-lg shadow-[#7dd3c0]/30'
                    : 'bg-transparent'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-[#1e2026]' : 'text-[#b8b5ad]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#7dd3c0]' : 'text-[#b8b5ad]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
