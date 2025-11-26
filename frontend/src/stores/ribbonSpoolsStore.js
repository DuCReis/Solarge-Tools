// frontend/src/stores/ribbonSpoolsStore.js
import { defineStore } from 'pinia';
import {
    fetchRibbonSpools,
    createRibbonSpool,
    updateRibbonSpool,
} from '@/api/ribbonSpools.js';

export const useRibbonSpoolsStore = defineStore('ribbonSpools', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadRibbonSpools(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                this.list = await fetchRibbonSpools(filters);
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao carregar ribbons.';
            } finally {
                this.loading = false;
            }
        },

        async addRibbonSpool(payload) {
            this.error = null;
            try {
                const created = await createRibbonSpool(payload);
                this.list.unshift(created);
                return created;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao criar ribbon spool.';
                throw err;
            }
        },

        async updateSpool(id, payload) {
            this.error = null;
            try {
                const updated = await updateRibbonSpool(id, payload);
                const idx = this.list.findIndex((s) => s.id === updated.id);
                if (idx !== -1) this.list[idx] = updated;
                return updated;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao atualizar ribbon spool.';
                throw err;
            }
        },
    },
});
