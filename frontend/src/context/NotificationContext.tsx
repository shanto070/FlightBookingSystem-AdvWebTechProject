'use client';

import { createContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

export interface AppNotification {
  id: string;
  event: string;
  payload: unknown;
  createdAt: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let socket: Socket | null = null;
    if (isAuthenticated && user) {
      socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string);
      socket.emit('join_room', { userId: user.id });

      const push = (event: string, payload: unknown) => {
        setNotifications((prev) => [
          { id: crypto.randomUUID(), event, payload, createdAt: new Date().toISOString() },
          ...prev,
        ]);
        setUnreadCount((v) => v + 1);
      };

      socket.on('booking_created', (payload) => push('booking_created', payload));
      socket.on('booking_status_updated', (payload) => push('booking_status_updated', payload));
      socket.on('flight_schedule_changed', (payload) => push('flight_schedule_changed', payload));
    }

    return () => {
      socket?.disconnect();
    };
  }, [isAuthenticated, user]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAllRead: () => setUnreadCount(0),
    }),
    [notifications, unreadCount],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
