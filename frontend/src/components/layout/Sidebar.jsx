import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthProvider.jsx';
import Button from '../ui/Button.jsx';
import corecrmLogo from '../../assets/corecrm-logo.png';
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  CheckSquare,
  LogOut
} from 'lucide-react';

const linkClass = ({ isActive }) =>
  isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link';

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className='sidebar flex flex-col'>
      <div className='flex items-center justify-center w-full text-center mt-2'>
        <img
          src={corecrmLogo}
          alt='CoreCRM'
          className='h-16 w-auto drop-shadow-md'
          draggable={false}
        />
      </div>

      <nav className='mt-5 flex flex-col gap-1'>
        <NavLink to='/dashboard' className={linkClass}>
          <LayoutDashboard className='h-4 w-4' aria-hidden='true' />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to='/contacts' className={linkClass}>
          <Users className='h-4 w-4' aria-hidden='true' />
          <span>Contacts</span>
        </NavLink>
        <NavLink to='/deals' className={linkClass}>
          <BriefcaseBusiness className='h-4 w-4' aria-hidden='true' />
          <span>Deals</span>
        </NavLink>
        <NavLink to='/tasks' className={linkClass}>
          <CheckSquare className='h-4 w-4' aria-hidden='true' />
          <span>Tasks</span>
        </NavLink>
      </nav>

      <div className='mt-auto pt-6'>
        <Button
          variant='secondary'
          className='w-full justify-start'
          onClick={async () => {
            await logout();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut className='h-4 w-4' aria-hidden='true' />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
