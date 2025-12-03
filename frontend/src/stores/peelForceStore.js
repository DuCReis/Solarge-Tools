// frontend/src/stores/peelForceStore.js
import { defineStore } from 'pinia';
import { fetchPeelForce, createPeelForce, fetchPeelForceById } from '@/api/peelForce.js';


export const usePeelForceStore = defineStore('peelForce', {
    state: () => ({
        list: [],
        current: null,
        loading: false,
        error: null,
    }),

    actions: {
        async loadPeelForceById(id) {
            this.loading = true;
            this.error = null;
            try {
                this.current = await fetchPeelForceById(id);
                return this.current;
            } catch (err) {
                console.error(err);
                this.error = 'Error loading peel force test.';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async loadPeelForce(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                this.list = await fetchPeelForce(filters);
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao carregar peel force.';
            } finally {
                this.loading = false;
            }
        },

        async addPeelForce(payload) {
            this.error = null;
            try {
                const created = await createPeelForce(payload);
                this.list.unshift(created);
                return created;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao registar peel force.';
                throw err;
            }
        },
    },
});
