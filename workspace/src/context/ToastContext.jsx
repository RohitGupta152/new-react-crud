import { createContext, useContext, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

const ToastContext = createContext(undefined);

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timers = timersRef.current;
    if (timers.has(id)) {
      clearTimeout(timers.get(id));
      timers.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = ++toastCounter;
      const item = {
        id,
        type: 'info',
        duration: 4000,
        ...toast,
      };
      setToasts((prev) => [...prev.slice(-3), item]);
      if (item.duration > 0) {
        const timer = setTimeout(() => dismiss(id), item.duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  const toast = useRef({
    success: (message, title) => push({ type: 'success', message, title }),
    error: (message, title) => push({ type: 'error', message, title, duration: 6000 }),
    warning: (message, title) => push({ type: 'warning', message, title }),
    info: (message, title) => push({ type: 'info', message, title }),
    dismiss,
  });

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss, toast: toast.current }}>
      {children}
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
