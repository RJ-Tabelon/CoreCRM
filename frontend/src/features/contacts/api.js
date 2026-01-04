import { api, normalizeApiError } from '../../services/apiClient.js';

export async function listContacts({ q } = {}) {
  try {
    const res = await api.get('/contacts', { params: q ? { q } : {} });
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function getContact(id) {
  try {
    const res = await api.get(`/contacts/${id}`);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function createContact(payload) {
  try {
    const res = await api.post('/contacts', payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function updateContact(id, payload) {
  try {
    const res = await api.put(`/contacts/${id}`, payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function deleteContact(id) {
  try {
    const res = await api.delete(`/contacts/${id}`);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function listContactNotes(contactId) {
  try {
    const res = await api.get(`/contacts/${contactId}/notes`);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function addContactNote(contactId, payload) {
  try {
    const res = await api.post(`/contacts/${contactId}/notes`, payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}
