export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className='page-header flex flex-col md:flex-row md:items-end md:justify-between gap-3 p-4 md:p-5'>
      <div>
        <h2 className='page-title'>{title}</h2>
        {subtitle ? <p className='page-subtitle mt-1'>{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className='flex items-center gap-2'>{actions}</div>
      ) : null}
    </div>
  );
}
