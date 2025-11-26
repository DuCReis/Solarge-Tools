// frontend/src/api/maintenance.js
import api from './axios.js';

export async function fetchMaintenance(params = {}) {
    const { data } = await api.get('/maintenance', { params });
    return data;
}

export async function createMaintenance(payload) {
    const { data } = await api.post('/maintenance', payload);
    return data;
}

export async function updateMaintenanceStatus(id, payload) {
    const { data } = await api.patch(`/maintenance/${id}/status`, payload);
    return data;
}
