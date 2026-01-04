import Button from './Button.jsx';

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}) {
  return (
    <div className='card'>
      <div className='card-body'>
        <div className='text-sm font-bold'>{title}</div>
        {description ? (
          <div className='mt-1 text-sm text-slate-600'>{description}</div>
        ) : null}
        {actionLabel ? (
          <div className='mt-4'>
            <Button variant='primary' onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
