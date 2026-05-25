import { useNavigate } from 'react-router-dom';
import { Camera, Trash2 } from 'lucide-react';
import { currentUser } from '../../data/appData';

interface DesktopEditProfileProps {
}

export default function DesktopEditProfile({}: DesktopEditProfileProps) {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:block min-h-screen bg-[#2a2d35] text-[#f5f3ed]">
      <div className="max-w-[700px] mx-auto p-8 min-h-screen flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#f5f3ed] mb-2">Edytuj Profil</h1>
          <p className="text-sm text-[#b8b5ad]">Zaktualizuj swoje informacje</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-2xl shadow-[#7dd3c0]/30 border-4 border-[#2a2d35]">
                <span className="text-3xl font-medium text-[#1e2026]">JK</span>
              </div>
              <button className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-lg border-2 border-[#2a2d35] hover:scale-110 transition-transform duration-300">
                <Camera className="w-5 h-5 text-[#1e2026]" />
              </button>
            </div>
            <p className="text-xs text-[#b8b5ad]">Kliknij, aby zmienić zdjęcie</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-[#b8b5ad] mb-2 block">Imię i nazwisko</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-[#b8b5ad] mb-2 block">Email</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-[#b8b5ad] mb-2 block">Wiek</label>
              <input
                type="number"
                placeholder="28"
                className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-[#b8b5ad] mb-2 block">Płeć</label>
              <select className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 focus:shadow-lg focus:shadow-[#7dd3c0]/10 transition-all duration-300">
                <option>Mężczyzna</option>
                <option>Kobieta</option>
                <option>Inna</option>
                <option>Wolę nie podawać</option>
              </select>
            </div>
          </div>

          <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 shadow-xl">
            <h3 className="text-sm font-medium text-[#f5f3ed] mb-4">Zmień Hasło</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Obecne hasło"
                className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/30 transition-all duration-300"
              />
              <input
                type="password"
                placeholder="Nowe hasło"
                className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/30 transition-all duration-300"
              />
              <input
                type="password"
                placeholder="Potwierdź nowe hasło"
                className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/30 transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-3 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20"
            >
              Zapisz Zmiany
            </button>

            <button className="backdrop-blur-md bg-transparent border-2 border-[#e88d8d]/40 text-[#e88d8d] font-medium py-3 rounded-2xl hover:bg-[rgba(232,141,141,0.1)] hover:border-[#e88d8d]/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Usuń konto
            </button>
          </div>

          <p className="text-xs text-center text-[#b8b5ad]">
            Usunięcie konta jest nieodwracalne i usunie wszystkie Twoje dane
          </p>
        </div>
      </div>
    </div>
  );
}
