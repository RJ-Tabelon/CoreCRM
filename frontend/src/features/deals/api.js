import { api, normalizeApiError } from '../../services/apiClient.js';

export async function listDeals() {
  try {
    const res = await api.get('/deals');
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function createDeal(payload) {
  try {
    const res = await api.post('/deals', payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function updateDeal(id, payload) {
  try {
    const res = await api.put(`/deals/${id}`, payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function deleteDeal(id) {
  try {
    const res = await api.delete(`/deals/${id}`);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}
