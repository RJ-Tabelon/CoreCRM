import DealColumn from './DealColumn.jsx';

export default function DealKanban({
  deals,
  contactsById,
  onDropDeal,
  onSelectDeal
}) {
  const grouped = {
    new: [],
    in_progress: [],
    won: [],
    lost: []
  };

  for (const d of deals) {
    (grouped[d.stage] || grouped.new).push(d);
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3'>
      <DealColumn
        title='New'
        stage='new'
        deals={grouped.new}
        contactsById={contactsById}
        onDropDeal={onDropDeal}
        onSelectDeal={onSelectDeal}
      />
      <DealColumn
        title='In Progress'
        stage='in_progress'
        deals={grouped.in_progress}
        contactsById={contactsById}
        onDropDeal={onDropDeal}
        onSelectDeal={onSelectDeal}
      />
      <DealColumn
        title='Won'
        stage='won'
        deals={grouped.won}
        contactsById={contactsById}
        onDropDeal={onDropDeal}
        onSelectDeal={onSelectDeal}
      />
      <DealColumn
        title='Lost'
        stage='lost'
        deals={grouped.lost}
        contactsById={contactsById}
        onDropDeal={onDropDeal}
        onSelectDeal={onSelectDeal}
      />
    </div>
  );
}
