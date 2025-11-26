// frontend/src/stores/authStore.js
import { defineStore } from 'pinia';
import api from '@/utils/apiClient.js';

const TOKEN_KEY = 'solarge_token';
const USER_KEY = 'solarge_user';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem(TOKEN_KEY) || null,
        user: localStorage.getItem(USER_KEY)
            ? JSON.parse(localStorage.getItem(USER_KEY))
            : null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(email, password) {
            const res = await api.post('/auth/login', { email, password });

            this.token = res.data.token;
            this.user = res.data.user;

            // guardar no localStorage
            localStorage.setItem(TOKEN_KEY, this.token);
            localStorage.setItem(USER_KEY, JSON.stringify(this.user));

            // meter header no axios
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        },

        logout() {
            // limpar estado
            this.token = null;
            this.user = null;

            // limpar storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);

            // limpar header
            delete api.defaults.headers.common['Authorization'];
        },
    },
});
