import { useNavigate } from 'react-router-dom';
import { Leaf, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

// Przenieś dane onboardingowe tutaj lub zaimportuj z firebaseData
const onboardingData = {
  tagline: 'Buduj lokalną społeczność, dziel się zasobami, redukuj ślad węglowy.',
  stats: [
    { label: 'Wymień', value: '150+' },
    { label: 'Oszczędź', value: '85%' },
    { label: 'Połącz', value: '100+' },
  ],
};

export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2d35] via-[#25292f] to-[#2a2d35] text-[#f5f3ed] flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-2xl shadow-[#7dd3c0]/30">
            <Leaf className="w-16 h-16 text-[#1e2026]" strokeWidth={2.5} />
          </div>
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
          <p className="text-lg text-[#f5f3ed] leading-relaxed px-4">
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
            <span className="text-xs text-[#b8b5ad]">Twoja społeczność czeka</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7dd3c0]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {onboardingData.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-medium bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-[#b8b5ad] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
