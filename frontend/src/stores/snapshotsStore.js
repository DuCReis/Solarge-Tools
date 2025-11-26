// frontend/src/stores/snapshotsStore.js
import { defineStore } from 'pinia';
import { fetchSnapshots, createSnapshot } from '@/api/machineSnapshots.js';

export const useSnapshotsStore = defineStore('snapshots', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadSnapshots(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                this.list = await fetchSnapshots(filters);
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao carregar snapshots.';
            } finally {
                this.loading = false;
            }
        },

        async addSnapshot(payload) {
            this.error = null;
            try {
                const created = await createSnapshot(payload);
                this.list.unshift(created);
                return created;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao criar snapshot.';
                throw err;
            }
        },
    },
});
