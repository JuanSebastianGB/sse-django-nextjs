import { NotificationContextType } from '@/types/NotificationContextType';
import { createContext, useContext } from 'react';

export const NotificationContext =
  createContext<NotificationContextType | null>(null);
NotificationContext.displayName = 'NotificationContext';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }
  return context;
};
