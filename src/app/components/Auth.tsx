import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Leaf,
} from "lucide-react";

interface AuthProps {
  onNavigate: (screen: string) => void;
}

export default function Auth({ onNavigate }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col p-4">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <header className="flex items-center gap-3 mb-8 pt-4">
          <button
            onClick={() => onNavigate("onboarding")}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-[#1e2026]" />
            </div>
            <h1 className="font-medium text-[#f5f3ed]">
              LocalLoop
            </h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-medium mb-2 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] bg-clip-text text-transparent">
              {isLogin
                ? "Witaj ponownie"
                : "Dołącz do społeczności"}
            </h2>
            <p className="text-sm text-[#b8b5ad]">
              {isLogin
                ? "Zaloguj się, aby kontynuować"
                : "Stwórz konto i zacznij współdzielić"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-[#7dd3c0]" />
                </div>
                <input
                  type="text"
                  placeholder="Imię i nazwisko"
                  className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Mail className="w-5 h-5 text-[#7dd3c0]" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Lock className="w-5 h-5 text-[#7dd3c0]" />
              </div>
              <input
                type="password"
                placeholder="Hasło"
                className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm text-[#7dd3c0] hover:text-[#a8d5ba] transition-colors"
                >
                  Zapomniałeś hasła?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 mt-6"
            >
              {isLogin
                ? "Zaloguj się"
                : "Dołącz do społeczności"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[#b8b5ad]"
            >
              {isLogin
                ? "Nie masz konta? "
                : "Masz już konto? "}
              <span className="text-[#7dd3c0] font-medium hover:text-[#a8d5ba] transition-colors">
                {isLogin ? "Zarejestruj się" : "Zaloguj się"}
              </span>
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-[#7dd3c0]/10">
            <p className="text-xs text-center text-[#b8b5ad] leading-relaxed">
              Dołączając do GreenPulse, akceptujesz nasze{" "}
              <span className="text-[#7dd3c0]">Warunki</span> i{" "}
              <span className="text-[#7dd3c0]">
                Politykę Prywatności
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}