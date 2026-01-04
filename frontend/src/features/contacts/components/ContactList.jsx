import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button.jsx';

export default function ContactList({ contacts, onEdit, onDelete }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
      {contacts.map(c => (
        <div key={c.id} className='card'>
          <div className='card-body'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <Link
                  to={`/contacts/${c.id}`}
                  className='text-base font-bold hover:underline'
                >
                  {c.name}
                </Link>
                <div className='mt-1 text-sm text-slate-600'>
                  {[c.email, c.phone, c.company].filter(Boolean).join(' • ') ||
                    '—'}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' onClick={() => onEdit(c)}>
                  Edit
                </Button>
                <Button variant='danger' onClick={() => onDelete(c)}>
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
