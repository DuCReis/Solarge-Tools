// frontend/src/utils/apiClient.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptor: mete o token (se existir) em todas as requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
