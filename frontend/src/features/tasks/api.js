import { api, normalizeApiError } from '../../services/apiClient.js';

export async function listTasks() {
  try {
    const res = await api.get('/tasks');
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function listMyTasks({ dueBefore } = {}) {
  try {
    const res = await api.get('/tasks/mine', {
      params: dueBefore ? { dueBefore } : {}
    });
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function createTask(payload) {
  try {
    const res = await api.post('/tasks', payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function updateTask(id, payload) {
  try {
    const res = await api.put(`/tasks/${id}`, payload);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function deleteTask(id) {
  try {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  } catch (e) {
    throw normalizeApiError(e);
  }
}
