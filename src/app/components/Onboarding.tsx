import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { LogoOnly } from './Logo';
import { useTheme } from '../../contexts/ThemeContext';

// Przenieś dane onboardingowe tutaj lub zaimportuj z firebaseData
const onboardingData = {
  tagline: 'Budujmy lokalną społeczność - dzielimy się zasobami, wymieniamy umiejętności, pomagamy nawzajem. Bez wymyślania opisów, bez problemów i bez stresu.',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-b from-[#2a2d35] via-[#25292f] to-[#2a2d35] text-[#f5f3ed]'
        : 'bg-gradient-to-b from-[#ede9e0] via-[#e8e4db] to-[#ede9e0] text-[#1e2026]'
    }`}>
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#7dd3c0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#89cff0]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-full blur-2xl opacity-40 animate-pulse" />
          <LogoOnly classes="relative w-32 h-32" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-[#89cff0]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-medium mb-4 bg-gradient-to-r from-[#7dd3c0] via-[#a8d5ba] to-[#89cff0] bg-clip-text text-transparent">
            LocalLoop
          </h1>
          <p className={`text-lg leading-relaxed px-4 transition-colors duration-300 ${
            darkMode ? 'text-[#f5f3ed]' : 'text-[#3a3d45]'
          }`}>
            {onboardingData.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full space-y-4"
        >
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-[1.5rem] hover:shadow-2xl hover:shadow-[#7dd3c0]/40 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 relative overflow-hidden group"
          >
            <span className="relative z-10">Rozpocznij Przygodę</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#a8d5ba] to-[#7dd3c0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7dd3c0]/30 to-transparent" />
            <span className={`text-xs transition-colors duration-300 ${
              darkMode ? 'text-[#b8b5ad]' : 'text-[#7a7872]'
            }`}>
              Twoja społeczność czeka
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7dd3c0]/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
