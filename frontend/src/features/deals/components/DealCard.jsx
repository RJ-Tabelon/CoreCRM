import Badge from '../../../components/ui/Badge.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export default function DealCard({ deal, contactName, onClick }) {
  return (
    <div
      className='glass-card glass-interactive p-3 cursor-pointer'
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('text/dealId', String(deal.id));
      }}
      onClick={onClick}
    >
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <div className='text-sm font-bold truncate'>{deal.title}</div>
          <div className='mt-1 text-xs text-slate-600 truncate'>
            {contactName || `Contact #${deal.contactId}`}
          </div>
        </div>
        <Badge stage={deal.stage} />
      </div>
      <div className='mt-2 text-sm font-semibold'>
        {formatCurrency(deal.amount)}
      </div>
    </div>
  );
}
