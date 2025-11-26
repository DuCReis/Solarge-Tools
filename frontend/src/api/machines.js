// src/api/machines.js
import api from './axios';

export async function fetchMachines() {
    const res = await api.get('/machines');
    return res.data;
}
