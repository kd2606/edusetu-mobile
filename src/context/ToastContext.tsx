import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastContextType = {
  showToast: (message: string) => void;
  hideToast: () => void;
  message: string | null;
  visible: boolean;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setVisible(true);

    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(() => {
      setVisible(false);
    }, 4000); // 4 seconds
    setTimer(newTimer);
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, message, visible }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
