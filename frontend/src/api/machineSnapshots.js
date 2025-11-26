// frontend/src/api/machineSnapshots.js
import api from './axios.js';

export async function fetchSnapshots(params = {}) {
    const { data } = await api.get('/snapshots', { params });
    return data;
}

export async function createSnapshot(payload) {
    const { data } = await api.post('/snapshots', payload);
    return data;
}

export async function getSnapshotById(id) {
    const { data } = await api.get(`/snapshots/${id}`);
    return data;
}
