import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';

import DashboardPage from '../features/dashboard/DashboardPage.jsx';
import ContactsPage from '../features/contacts/pages/ContactsPage.jsx';
import ContactDetailPage from '../features/contacts/pages/ContactDetailPage.jsx';
import DealsPage from '../features/deals/pages/DealsPage.jsx';
import MyTasksPage from '../features/tasks/pages/MyTasksPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />

      <Route
        path='/'
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to='/dashboard' replace />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='contacts' element={<ContactsPage />} />
        <Route path='contacts/:id' element={<ContactDetailPage />} />
        <Route path='deals' element={<DealsPage />} />
        <Route path='tasks' element={<MyTasksPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
