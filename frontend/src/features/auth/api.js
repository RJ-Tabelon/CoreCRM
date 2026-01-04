import { api, normalizeApiError } from '../../services/apiClient.js';

export async function signUp({ name, email, password }) {
  try {
    const res = await api.post('/auth/sign-up', { name, email, password });
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function signIn({ email, password }) {
  try {
    const res = await api.post('/auth/sign-in', { email, password });
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function signOut() {
  try {
    const res = await api.post('/auth/sign-out');
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}
