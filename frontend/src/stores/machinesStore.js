// frontend/src/stores/machinesStore.js
import { defineStore } from 'pinia';
import api from '../utils/apiClient.js';

export const useMachinesStore = defineStore('machines', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadMachines(force = false) {
            if (this.list.length > 0 && !force) return;

            this.loading = true;
            this.error = null;
            try {
                const res = await api.get('/machines');
                this.list = res.data || [];
            } catch (err) {
                console.error('Erro ao carregar máquinas:', err);
                this.error = 'Erro ao carregar máquinas';
            } finally {
                this.loading = false;
            }
        },
    },
});
