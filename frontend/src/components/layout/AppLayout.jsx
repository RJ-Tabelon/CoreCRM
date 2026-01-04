import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function AppLayout() {
  return (
    <div className='layout-shell'>
      <Sidebar />
      <div className='min-w-0'>
        <main className='page'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
