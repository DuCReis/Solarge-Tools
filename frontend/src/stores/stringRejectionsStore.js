// frontend/src/stores/stringRejectionsStore.js
import { defineStore } from 'pinia';
import api from '@/api/axios.js'; // 👈 usa o teu axios.js

export const useRejectionsStore = defineStore('rejections', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadRejections(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.get('/string-rejections', { params: filters });
                this.list = res.data || [];
            } catch (err) {
                console.error('Erro ao carregar rejections:', err);
                this.error = 'Erro ao carregar rejections';
            } finally {
                this.loading = false;
            }
        },

        async addRejection(payload) {
            this.error = null;
            try {
                const res = await api.post('/string-rejections', payload);
                return res.data;
            } catch (err) {
                console.error('Erro ao criar rejection:', err);
                this.error = 'Erro ao criar rejection';
                throw err;
            }
        },
    },
});
