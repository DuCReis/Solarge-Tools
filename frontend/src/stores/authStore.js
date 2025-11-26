// frontend/src/stores/authStore.js
import { defineStore } from 'pinia';
import api from '../utils/apiClient.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('auth_token') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login({ email, password }) {
            try {
                const { data } = await api.post('/auth/login', { email, password });
                // backend devolve { token, user }
                this.token = data.token;
                this.user = data.user;

                localStorage.setItem('auth_token', data.token);
            } catch (err) {
                console.error('Login error:', err);
                throw err; // para o LoginView poder mostrar mensagem
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('auth_token');
        },
    },
});
