import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/index.jsx';
import { ToastProvider } from './components/common/ToastProvider.jsx';
import { AuthProvider } from './components/common/AuthProvider.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
