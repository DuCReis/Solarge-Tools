// frontend/src/api/ribbonSpools.js
import api from './axios.js';

export async function fetchRibbonSpools(params = {}) {
    const { data } = await api.get('/ribbon-spools', { params });
    return data;
}

export async function createRibbonSpool(payload) {
    const { data } = await api.post('/ribbon-spools', payload);
    return data;
}

export async function updateRibbonSpool(id, payload) {
    const { data } = await api.patch(`/ribbon-spools/${id}`, payload);
    return data;
}
