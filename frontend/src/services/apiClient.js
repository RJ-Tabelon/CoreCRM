import axios from 'axios';

function normalizeBaseURL(raw) {
  if (!raw) return '/api';

  // Allow either:
  // - VITE_API_URL=http://localhost:3000      (we append /api)
  // - VITE_API_URL=http://localhost:3000/api (use as-is)
  // - VITE_API_URL=/api                      (use as-is, prod behind Nginx)
  const trimmed = String(raw).replace(/\/+$/, '');
  if (trimmed === '/api' || trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

const baseURL = normalizeBaseURL(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function normalizeApiError(error) {
  const response = error?.response;
  const data = response?.data;

  if (typeof data === 'string') {
    return new Error(data);
  }

  const message =
    data?.details ||
    data?.message ||
    data?.error ||
    error?.message ||
    'Request failed';

  const err = new Error(message);
  err.status = response?.status;
  err.data = data;
  return err;
}
