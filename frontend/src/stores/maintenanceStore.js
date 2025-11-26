// frontend/src/stores/maintenanceStore.js
import { defineStore } from 'pinia';
import {
    fetchMaintenance,
    createMaintenance,
    updateMaintenanceStatus,
} from '@/api/maintenance.js';

export const useMaintenanceStore = defineStore('maintenance', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadMaintenance(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                this.list = await fetchMaintenance(filters);
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao carregar manutenções.';
            } finally {
                this.loading = false;
            }
        },

        async addMaintenance(payload) {
            this.error = null;
            try {
                const created = await createMaintenance(payload);
                this.list.unshift(created);
                return created;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao registar manutenção.';
                throw err;
            }
        },

        async changeStatus(id, payload) {
            this.error = null;
            try {
                const updated = await updateMaintenanceStatus(id, payload);
                const idx = this.list.findIndex((m) => m.id === updated.id);
                if (idx !== -1) this.list[idx] = updated;
                return updated;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao atualizar manutenção.';
                throw err;
            }
        },
    },
});
