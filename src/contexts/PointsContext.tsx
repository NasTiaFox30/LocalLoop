// contexts/PointsContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode} from 'react';
import type { Notification } from '../app/components/PointsNotification';

interface PointsContextType {
  notifications: Notification[];
  addNotification: (points: number, message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  showPointsEarned: (points: number, action: string, target?: string) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((points: number, message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: `points-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      points,
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showPointsEarned = useCallback((points: number, action: string, target?: string) => {
    let message = '';
    let type: Notification['type'] = 'earned';

    if (action === 'completed_help') {
      message = target 
        ? `Otrzymałeś ${points} pkt. za pomoc przy "${target}"`
        : `Otrzymałeś ${points} pkt. za udzieloną pomoc`;
      type = 'earned';
    } else if (action === 'received_help') {
      message = target
        ? `Dostałeś ${points} pkt. za skorzystanie z oferty "${target}"`
        : `Dostałeś ${points} pkt. za skorzystanie z oferty`;
      type = 'received';
    } else if (action === 'bonus') {
      message = target
        ? `Bonus ${points} pkt. za udostępnienie "${target}"`
        : `Bonus ${points} pkt. za udostępnienie`;
      type = 'bonus';
    } else if (action === 'offer_shared') {
      message = target
        ? `+${points} pkt. za udostępnienie "${target}" sąsiadom! 🌟`
        : `+${points} pkt. za udzieloną pomoc! 🌟`;
      type = 'bonus';
    } else {
      message = `Zdobyłeś ${points} punktów społecznościowych! 🎉`;
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