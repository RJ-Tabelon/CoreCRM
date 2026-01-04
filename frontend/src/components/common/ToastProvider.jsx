/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = ({ type = 'info', message }) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, type, message }]);
    window.setTimeout(() => removeToast(id), 3500);
  };

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className='pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2'>
        {toasts.map(t => (
          <div key={t.id} className='toast'>
            <div className='p-3'>
              <div className='flex items-start justify-between gap-3'>
                <div className='text-sm font-semibold'>
                  {t.type === 'success'
                    ? 'Success'
                    : t.type === 'error'
                    ? 'Error'
                    : 'Info'}
                </div>
                <button
                  className='text-slate-500 hover:text-slate-700 text-sm'
                  onClick={() => removeToast(t.id)}
                >
                  ✕
                </button>
              </div>
              <div
                className={
                  t.type === 'error'
                    ? 'mt-1 text-sm text-rose-700'
                    : t.type === 'success'
                    ? 'mt-1 text-sm text-emerald-700'
                    : 'mt-1 text-sm text-slate-700'
                }
              >
                {t.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
