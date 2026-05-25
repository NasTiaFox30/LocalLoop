import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Leaf, Users, LogIn, Loader2 } from 'lucide-react';
import { signIn, signUp, getAllUsers, getCurrentUser, type User } from '../../data/firebaseData';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(true);

  useEffect(() => {
    const loadDemoUsers = async () => {
      try {
        const users = await getAllUsers();
        setDemoUsers(users.slice(0, 5));
      } catch (error) {
        console.error('Failed to load demo users:', error);
      } finally {
        setLoadingDemo(false);
      }
    };
    loadDemoUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('Proszę podać email i hasło');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        alert('Nie znaleziono użytkownika z tym adresem email');
      } else if (error.code === 'auth/wrong-password') {
        alert('Nieprawidłowe hasło');
      } else if (error.code === 'auth/invalid-email') {
        alert('Nieprawidłowy adres email');
      } else {
        alert(error.message || 'Błąd logowania');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Proszę podać imię i nazwisko');
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert('Proszę podać email i hasło');
      return;
    }
    if (password.length < 6) {
      alert('Hasło musi mieć co najmniej 6 znaków');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Ten adres email jest już używany');
      } else if (error.code === 'auth/invalid-email') {
        alert('Nieprawidłowy adres email');
      } else {
        alert(error.message || 'Błąd rejestracji');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (user: User) => {
    // Demo login wymaga hasła - w rzeczywistej aplikacji nie powinno być takiego panelu
    // To jest tylko dla celów demonstracyjnych
    alert('Aby zalogować się na konto demo, użyj danych logowania tego konta.\n\nEmail: ' + user.email + '\nHasło: (hasło utworzone podczas rejestracji)');
  };

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] flex flex-col p-4">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <header className="flex items-center gap-3 mb-8 pt-4">
          <button
            onClick={() => navigate('/onboarding')}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-[#1e2026]" />
            </div>
            <h1 className="font-medium text-[#f5f3ed]">LocalLoop</h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-medium mb-2 bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] bg-clip-text text-transparent">
              {isLogin ? 'Witaj ponownie' : 'Dołącz do społeczności'}
            </h2>
            <p className="text-sm text-[#b8b5ad]">
              {isLogin 
                ? 'Zaloguj się, aby kontynuować' 
                : 'Stwórz konto i zacznij współdzielić'}
            </p>
          </div>

          {/* Panel szybkiego logowania (demo/test) - tylko jeśli są użytkownicy */}
          {demoUsers.length > 0 && !loadingDemo && (
            <div className="mb-6 backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-[#7dd3c0]" />
                <span className="text-xs font-medium text-[#b8b5ad]">Szybki wybór konta (demo)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {demoUsers.map((user) => {
                  const currentUser = getCurrentUser();
                  const isCurrent = currentUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleDemoLogin(user)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] shadow-lg'
                          : 'backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 text-[#f5f3ed] hover:border-[#7dd3c0]/40 hover:scale-105'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center`}>
                        <span className="text-[10px] font-medium text-[#1e2026]">{user.initials}</span>
                      </div>
                      {user.name}
                      {isCurrent && <span className="text-[10px]">(obecny)</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#b8b5ad] text-center mt-3">
                💡 Wybierz konto demo – do logowania użyj danych tego konta
              </p>
            </div>
          )}

          {/* LUB separator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7dd3c0]/30 to-transparent" />
            <span className="text-xs text-[#b8b5ad]">LUB</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7dd3c0]/30 to-transparent" />
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Users className="w-5 h-5 text-[#7dd3c0]" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Imię i nazwisko"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300 disabled:opacity-50"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Mail className="w-5 h-5 text-[#7dd3c0]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Lock className="w-5 h-5 text-[#7dd3c0]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? 'Proszę czekać...' : (isLogin ? 'Zaloguj się' : 'Dołącz do społeczności')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              disabled={loading}
              className="text-sm text-[#b8b5ad] hover:text-[#7dd3c0] transition-colors"
            >
              {isLogin ? 'Nie masz konta? ' : 'Masz już konto? '}
              <span className="text-[#7dd3c0] font-medium">
                {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
              </span>
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-[#7dd3c0]/10">
            <p className="text-xs text-center text-[#b8b5ad] leading-relaxed">
              Dołączając, akceptujesz nasze{' '}
              <span className="text-[#7dd3c0]">Warunki</span> i{' '}
              <span className="text-[#7dd3c0]">Politykę Prywatności</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}