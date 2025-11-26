// frontend/src/utils/apiClient.js
import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore.js';

const TOKEN_KEY = 'solarge_token';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// token inicial (se existir)
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const auth = useAuthStore();

            // ❗ Só faz logout/redireciona se *achamos* que o user estava autenticado
            if (auth.isAuthenticated) {
                auth.logout?.();
                router.push({ name: 'login' });
            }
        }

        return Promise.reject(error);
    },
);

export default api;
