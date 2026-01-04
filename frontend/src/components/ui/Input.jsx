import { cn } from '../../utils/cn.js';

export default function Input({ label, className, error, ...props }) {
  return (
    <label className='block'>
      {label ? <div className='mb-1 text-sm font-semibold'>{label}</div> : null}
      <input className={cn('input', className)} {...props} />
      {error ? <div className='mt-1 text-xs text-rose-700'>{error}</div> : null}
    </label>
  );
}
