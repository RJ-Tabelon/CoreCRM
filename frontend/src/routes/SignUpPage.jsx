import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useToast } from '../components/common/ToastProvider.jsx';
import { useAuth } from '../components/common/AuthProvider.jsx';
import { signUp } from '../features/auth/api.js';

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { setUser } = useAuth();

  const redirectTo = useMemo(
    () => location.state?.from || '/dashboard',
    [location.state]
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email, and password are required');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({ name, email, password });
      // Backend sets httpOnly cookie; persist user for app state.
      if (result.user) setUser(result.user);
      showToast({
        type: 'success',
        message: result.message || 'Account created'
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err?.message || 'Failed to sign up';
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
          <h1 className='page-title text-slate-600'>Create Account</h1>
          <p className='page-subtitle mt-1'>
            Get started with{' '}
            <span className='font-bold' style={{ color: 'var(--crm-primary)' }}>
              Core
            </span>
            <span
              className='font-bold'
              style={{ color: 'var(--crm-secondary)' }}
            >
              CRM
            </span>
          </p>

          <form className='mt-6 space-y-3 text-slate-600' onSubmit={onSubmit}>
            <Input
              label='Name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Your name'
              autoComplete='name'
            />
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
              autoComplete='new-password'
            />

            {error ? (
              <div className='text-sm text-rose-700'>{error}</div>
            ) : null}

            <Button
              type='submit'
              variant='secondary'
              className='w-full mt-1'
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>

          <div className='mt-4 text-sm text-slate-600'>
            Already have an account?{' '}
            <Link to='/login' className='font-semibold underline'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
