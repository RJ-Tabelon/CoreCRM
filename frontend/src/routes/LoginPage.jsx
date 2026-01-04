import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useToast } from '../components/common/ToastProvider.jsx';
import { useAuth } from '../components/common/AuthProvider.jsx';
import { signIn } from '../features/auth/api.js';

// Persist only the email for convenience. Never store passwords client-side.
const REMEMBER_ME_KEY = 'corecrm_remember_me';
const REMEMBERED_EMAIL_KEY = 'corecrm_remembered_email';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { setUser } = useAuth();

  const redirectTo = useMemo(
    () => location.state?.from || '/dashboard',
    [location.state]
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const remember = localStorage.getItem(REMEMBER_ME_KEY) === '1';
      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
      setRememberMe(remember);
      if (remember && savedEmail) setEmail(savedEmail);
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      if (!rememberMe) {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        return;
      }

      localStorage.setItem(REMEMBER_ME_KEY, '1');
      // Only persist non-empty email; keep password blank by default.
      if (email.trim())
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
    } catch {
      // ignore
    }
  }, [hydrated, rememberMe, email]);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn({ email, password });
      setUser(result.user);
      showToast({ type: 'success', message: 'Signed in successfully' });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err?.message || 'Failed to sign in';
      setError(message);
      showToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid place-items-center app-bg p-4'>
      <div className='card w-full max-w-md'>
        <div className='card-body'>
          <h1 className='page-title text-slate-600'>Sign In</h1>
          <p className='page-subtitle mt-1'>
            Use your{' '}
            <span className='font-bold' style={{ color: 'var(--crm-primary)' }}>
              Core
            </span>
            <span
              className='font-bold'
              style={{ color: 'var(--crm-secondary)' }}
            >
              CRM
            </span>{' '}
            account
          </p>

          <form className='mt-6 space-y-3 text-slate-600' onSubmit={onSubmit}>
            <Input
              label='Email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='you@example.com'
              autoComplete='email'
            />
            <Input
              label='Password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='••••••••'
              autoComplete='current-password'
            />

            <label className='flex items-center gap-2 text-sm text-slate-600 select-none'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className='h-4 w-4 rounded border-white/60 bg-white/70 align-middle'
              />
              <span>Remember me</span>
            </label>

            {error ? (
              <div className='text-sm text-rose-700'>{error}</div>
            ) : null}

            <Button
              type='submit'
              variant='secondary'
              className='w-full'
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className='mt-4 text-sm text-slate-600'>
            New here?{' '}
            <Link to='/sign-up' className='font-semibold underline'>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
