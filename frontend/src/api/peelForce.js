// frontend/src/api/peelForce.js
import api from './axios.js';

export async function fetchPeelForce(filters = {}) {
    const qs = new URLSearchParams();

    if (filters.machineId) {
        qs.append('machineId', filters.machineId);
    }

    if (filters.from) {
        qs.append('from', filters.from); // formato YYYY-MM-DD vindo do <input type="date">
    }

    if (filters.to) {
        qs.append('to', filters.to);
    }

    const url = qs.toString() ? `/peel-force?${qs.toString()}` : '/peel-force';

    const { data } = await api.get(url);
    return data;
}

export async function createPeelForce(payload) {
    const { data } = await api.post('/peel-force', payload);
    return data;
}

export async function fetchPeelForceById(id) {
    const res = await api.get(`/peel-force/${id}`);
    return res.data;
}
