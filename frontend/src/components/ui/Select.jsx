import { cn } from '../../utils/cn.js';

export default function Select({
  label,
  className,
  error,
  children,
  ...props
}) {
  return (
    <label className='block'>
      {label ? <div className='mb-1 text-sm font-semibold'>{label}</div> : null}
      <div className='relative'>
        <select className={cn('select', className)} {...props}>
          {children}
        </select>
        <svg
          aria-hidden='true'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.936a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z'
            clipRule='evenodd'
          />
        </svg>
      </div>
      {error ? <div className='mt-1 text-xs text-rose-700'>{error}</div> : null}
    </label>
  );
}
