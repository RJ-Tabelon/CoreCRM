import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

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
