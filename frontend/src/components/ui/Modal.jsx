import { useEffect } from 'react';
import { cn } from '../../utils/cn.js';

export default function Modal({ open, title, children, onClose, className }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-40 grid place-items-center p-4'>
      <div className='absolute inset-0 modal-backdrop' onClick={onClose} />
      <div className={cn('relative w-full max-w-2xl card', className)}>
        <div className='modal-header'>
          <div className='text-sm font-bold'>{title}</div>
          <button className='icon-btn' onClick={onClose}>
            ✕
          </button>
        </div>
        <div className='card-body'>{children}</div>
      </div>
    </div>
  );
}
