'use client';

import { NotificationContext } from '@/contexts/NotificationContext';
import { NotificationProviderType } from '@/types/NotificationContextType';
import { useState } from 'react';

export const NotificationProvider = ({
  children,
}: NotificationProviderType) => {
  const [counter, setCounter] = useState(0);
  return (
    <NotificationContext.Provider value={{ counter }}>
      {children}
    </NotificationContext.Provider>
  );
};
