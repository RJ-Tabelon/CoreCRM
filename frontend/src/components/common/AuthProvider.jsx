/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { api, normalizeApiError } from '../../services/apiClient.js';
import { signOut } from '../../features/auth/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'corecrm_user';

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);

  // Persisting the *user profile* locally improves UX across refreshes, but the
  // real session is cookie-based (httpOnly token). We validate the cookie on
  // boot so a stale local user doesn't keep the UI "logged in" after expiry.
  const setUser = nextUser => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  useEffect(() => {
    let cancelled = false;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      setUserState(parsed);

      // Cookie session restore/validation: confirm the httpOnly cookie is still valid.
      // Backend doesn't expose /me, so we validate by calling an authenticated endpoint.
      (async () => {
        try {
          const res = await api.get(`/users/${parsed.id}`);
          const freshUser = res?.data?.user;
          if (!cancelled && freshUser) setUser(freshUser);
        } catch (e) {
          const err = normalizeApiError(e);
          // Only clear local state when we definitively know auth is invalid.
          if (!cancelled && (err.status === 401 || err.status === 403)) {
            setUser(null);
          }
        }
      })();
    } catch {
      // ignore
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    try {
      await signOut();
    } catch (e) {
      // Even if the backend rejects, clear local state.
      normalizeApiError(e);
    } finally {
      // Clears only the session + user profile. "Remember me" email is separate.
      setUser(null);
    }
  };

  const value = { user, setUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
