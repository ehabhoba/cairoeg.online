
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Notification from '../components/Notification';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  addNotification: (
    title: string,
    message?: string,
    type?: NotificationType,
    duration?: number
  ) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      title: string,
      message?: string,
      type: NotificationType = 'info',
      duration: number = 5000
    ) => {
      const newNotification: Notification = {
        id: Date.now(),
        title,
        message,
        type,
        duration,
      };
      setNotifications((prev) => [...prev, newNotification]);
    },
    []
  );

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onDismiss={dismissNotification}
            />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};
