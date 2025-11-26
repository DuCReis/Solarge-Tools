// frontend/src/api/layupEvents.js
import api from './axios.js'; // <-- o teu axios configurado

export async function fetchLayupEvents(params = {}) {
    const response = await api.get('/layup-events', { params });
    return response.data;
}

export async function createLayupEvent(payload) {
    const response = await api.post('/layup-events', payload);
    return response.data;
}
