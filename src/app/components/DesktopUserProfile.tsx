import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Edit, Bell, Package, Moon, Sun, HelpCircle, LogOut, ChevronRight } from "lucide-react";

interface DesktopUserProfileProps {
}

export default function DesktopUserProfile({}: DesktopUserProfileProps) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [notificationMode, setNotificationMode] = useState<'all' | 'important' | 'disabled'>('all');

  const settingsItems = [
    { icon: Edit, label: "Edytuj profil", onClick: () => navigate('/edit-profile') },
    { icon: Package, label: "Moje ogłoszenia", onClick: () => navigate('/my-listings') },
    { icon: HelpCircle, label: "Pomoc i wsparcie", onClick: () => {} },
  ];

  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[900px] mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Profil Użytkownika</h1>
          <p className="text-sm text-[#b8b5ad]">Zarządzaj swoim kontem i preferencjami</p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-2xl shadow-[#7dd3c0]/30 border-4 border-[#2a2d35]">
                    <span className="text-3xl font-medium text-[#1e2026]">JK</span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-lg border-2 border-[#2a2d35] hover:scale-110 transition-transform duration-300">
                    <Edit className="w-4 h-4 text-[#1e2026]" />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-medium text-[#f5f3ed] mb-1">Jan Kowalski</h2>
                  <p className="text-sm text-[#b8b5ad] mb-4">jan.kowalski@email.com</p>
                  <p className="text-xs text-[#b8b5ad]">Członek społeczności od stycznia 2024</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/10 flex items-center justify-center">
                    {darkMode ? <Moon className="w-5 h-5 text-[#7dd3c0]" /> : <Sun className="w-5 h-5 text-[#7dd3c0]" />}
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#f5f3ed]">Tryb ciemny</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      darkMode ? "bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba]" : "bg-[rgba(80,85,95,0.5)]"
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-[#f5f3ed] shadow-lg transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#7dd3c0]" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#f5f3ed]">Powiadomienia</span>
                </div>
                <div className="flex gap-2 ml-15">
                  {(['all', 'important', 'disabled'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setNotificationMode(mode)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        notificationMode === mode
                          ? "bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] shadow-lg"
                          : "bg-[rgba(40,43,50,0.4)] text-[#b8b5ad] hover:bg-[rgba(60,65,75,0.5)]"
                      }`}
                    >
                      {mode === 'all' ? 'Wszystkie' : mode === 'important' ? 'Ważne' : 'Wyłączone'}
                    </button>
                  ))}
                </div>
              </div>

              {settingsItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/10 rounded-2xl p-4 hover:border-[#7dd3c0]/25 hover:scale-[1.01] transition-all duration-300 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7dd3c0]/20 to-[#89cff0]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#7dd3c0]" />
                  </div>
                  <span className="flex-1 text-left text-sm font-medium text-[#f5f3ed]">{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-[#b8b5ad]" />
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full backdrop-blur-md bg-gradient-to-br from-[rgba(232,141,141,0.1)] to-transparent border-2 border-[#e88d8d]/30 rounded-2xl p-4 hover:border-[#e88d8d]/50 hover:bg-[rgba(232,141,141,0.15)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <LogOut className="w-5 h-5 text-[#e88d8d]" />
              <span className="font-medium text-[#e88d8d]">Wyloguj się</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
