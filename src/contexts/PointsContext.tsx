import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { setPointsNotificationCallback as setGlobalPointsNotificationCallback } from '../data/firebaseData';

export interface PointsNotification {
  id: string;
  points: number;
  message: string;
  type: 'earned' | 'received' | 'bonus';
  timestamp: number;
}

interface PointsContextType {
  notifications: PointsNotification[];
  addNotification: (points: number, message: string, type: PointsNotification['type']) => void;
  removeNotification: (id: string) => void;
  showPointsEarned: (points: number, action: string, target?: string) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const setPointsNotificationCallback = (callback: ((points: number, action: string, target?: string) => void) | null) => {
  setGlobalPointsNotificationCallback(callback);
};

export function PointsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<PointsNotification[]>([]);

  const addNotification = useCallback((points: number, message: string, type: PointsNotification['type']) => {
    const newNotification: PointsNotification = {
      id: `points-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      points,
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-usuń po 4 sekundach
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showPointsEarned = useCallback((points: number, action: string, target?: string) => {
    let message = '';
    let type: PointsNotification['type'] = 'earned';

    if (action === 'completed_help') {
      message = target 
        ? `🎉 Otrzymałeś ${points} pkt. za pomoc przy "${target}"!`
        : `🎉 Otrzymałeś ${points} pkt. za udzieloną pomoc!`;
      type = 'earned';
    } else if (action === 'received_help') {
      message = target
        ? `✨ Dostałeś ${points} pkt. za skorzystanie z oferty "${target}"!`
        : `✨ Dostałeś ${points} pkt. za skorzystanie z oferty!`;
      type = 'received';
    } else if (action === 'bonus') {
      message = target
        ? `🌟 Bonus ${points} pkt. za udostępnienie "${target}" sąsiadom!`
        : `🌟 Bonus ${points} pkt. za udzieloną pomoc!`;
      type = 'bonus';
    } else if (action === 'offer_shared') {
      message = target
        ? `🏆 +${points} pkt. za udostępnienie "${target}" społeczności!`
        : `🏆 +${points} pkt. za udzieloną pomoc!`;
      type = 'bonus';
    } else {
      message = `🎯 Zdobyłeś ${points} punktów społecznościowych!`;
    }

    addNotification(points, message, type);
  }, [addNotification]);

  return (
    <PointsContext.Provider value={{ notifications, addNotification, removeNotification, showPointsEarned }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (!context) throw new Error('usePoints must be used within PointsProvider');
  return context;
}