import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export interface Notification {
  id: string;
  points: number;
  message: string;
  type: 'earned' | 'received' | 'bonus';
  timestamp: number;
}

interface PointsNotificationProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function PointsNotification({ notifications, onRemove }: PointsNotificationProps) {
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        onRemove(notifications[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications, onRemove]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'earned':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'received':
        return <Sparkles className="w-5 h-5 text-[#7dd3c0]" />;
      case 'bonus':
        return <TrendingUp className="w-5 h-5 text-[#89cff0]" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'earned':
        return 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 'received':
        return 'from-[#7dd3c0]/20 to-[#a8d5ba]/10 border-[#7dd3c0]/30';
      case 'bonus':
        return 'from-[#89cff0]/20 to-[#7dd3c0]/10 border-[#89cff0]/30';
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 lg:bottom-8 lg:right-8 flex flex-col gap-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`backdrop-blur-xl bg-gradient-to-br ${getBgColor(notification.type)} border rounded-2xl p-4 min-w-[280px] shadow-2xl shadow-black/20`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-white">+{notification.points}</span>
                  <span className="text-xs text-[#b8b5ad]">punktów</span>
                </div>
                <p className="text-sm text-[#f5f3ed]">{notification.message}</p>
                <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    className={`h-full rounded-full ${
                      notification.type === 'earned' 
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                        : notification.type === 'received'
                        ? 'bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba]'
                        : 'bg-gradient-to-r from-[#89cff0] to-[#7dd3c0]'
                    }`}
                  />
                </div>
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className="text-[#b8b5ad] hover:text-[#f5f3ed] transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}