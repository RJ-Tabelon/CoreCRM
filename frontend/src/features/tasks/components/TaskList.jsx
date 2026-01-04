import Button from '../../../components/ui/Button.jsx';
import { formatDate } from '../../../utils/formatDate.js';

export default function TaskList({
  tasks,
  contactsById,
  dealsById,
  onToggleStatus,
  onEdit,
  onDelete
}) {
  return (
    <div className='space-y-2'>
      {tasks.map(t => (
        <div key={t.id} className='card'>
          <div className='card-body'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <div className='text-sm font-bold'>{t.title}</div>
                <div className='mt-1 text-xs text-slate-600'>
                  {t.dueDate ? `Due ${formatDate(t.dueDate)}` : 'No due date'}
                  {t.contactId
                    ? ` • ${
                        contactsById.get(t.contactId) ||
                        `Contact #${t.contactId}`
                      }`
                    : ''}
                  {t.dealId
                    ? ` • ${dealsById.get(t.dealId) || `Deal #${t.dealId}`}`
                    : ''}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' onClick={() => onToggleStatus(t)}>
                  {t.status === 'open' ? 'Mark done' : 'Reopen'}
                </Button>
                <Button variant='ghost' onClick={() => onEdit(t)}>
                  Edit
                </Button>
                <Button variant='danger' onClick={() => onDelete(t)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
