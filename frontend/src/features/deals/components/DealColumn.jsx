import DealCard from './DealCard.jsx';

export default function DealColumn({
  title,
  stage,
  deals,
  contactsById,
  onDropDeal,
  onSelectDeal
}) {
  return (
    <div
      className='card min-h-[320px]'
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        const dealId = e.dataTransfer.getData('text/dealId');
        if (dealId) onDropDeal(Number(dealId), stage);
      }}
    >
      <div className='glass-divider px-4 py-3 flex items-center justify-between'>
        <div className='text-sm font-bold'>{title}</div>
        <div className='text-xs text-slate-600'>{deals.length}</div>
      </div>
      <div className='p-3 space-y-2'>
        {deals.map(d => (
          <DealCard
            key={d.id}
            deal={d}
            contactName={contactsById.get(d.contactId)}
            onClick={() => onSelectDeal(d)}
          />
        ))}
      </div>
    </div>
  );
}
