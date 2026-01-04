import Button from '../ui/Button.jsx';
import { useLocation } from 'react-router-dom';

export default function Topbar({ onLogout, onQuickAction }) {
  const location = useLocation();
  const basePath = '/' + location.pathname.split('/')[1];

  const quickAction =
    basePath === '/contacts'
      ? { label: 'New Contact', action: 'contact' }
      : basePath === '/deals'
      ? { label: 'New Deal', action: 'deal' }
      : basePath === '/tasks'
      ? { label: 'New Task', action: 'task' }
      : null;

  return (
    <header className='topbar'>
      <div className='text-2xl font-extrabold tracking-tight'>
        <span style={{ color: 'var(--crm-primary)' }}>Core</span>CRM
      </div>

      <div className='flex items-center gap-2'>
        {quickAction ? (
          <Button
            variant='primary'
            onClick={() => onQuickAction?.(quickAction.action)}
          >
            {quickAction.label}
          </Button>
        ) : null}
        <Button variant='ghost' onClick={onLogout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
