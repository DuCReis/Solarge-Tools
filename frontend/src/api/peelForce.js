// frontend/src/api/peelForce.js
import api from './axios.js';

export async function fetchPeelForce(params = {}) {
    const { data } = await api.get('/peel-force', { params });
    return data;
}

export async function createPeelForce(payload) {
    const { data } = await api.post('/peel-force', payload);
    return data;
}
