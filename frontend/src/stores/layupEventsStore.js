// frontend/src/stores/layupEventsStore.js
import { defineStore } from 'pinia';
import { fetchLayupEvents, createLayupEvent } from '@/api/layupEvents.js';

export const useLayupEventsStore = defineStore('layupEvents', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadEvents(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const data = await fetchLayupEvents(params);
                this.list = Array.isArray(data) ? data : [];
            } catch (err) {
                console.error('[layupEvents] loadEvents error', err);
                this.error = err?.response?.data?.message || err.message || 'Erro a carregar eventos de layup.';
            } finally {
                this.loading = false;
            }
        },

        async addEvent(payload) {
            this.loading = true;
            this.error = null;
            try {
                const created = await createLayupEvent(payload);
                // podes ou fazer push ou recarregar a lista
                this.list.unshift(created);
                return created;
            } catch (err) {
                console.error('[layupEvents] addEvent error', err);
                this.error = err?.response?.data?.message || err.message || 'Erro a criar evento de layup.';
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});
