// frontend/src/stores/recipeChangesStore.js
import { defineStore } from 'pinia';
import { fetchRecipeChanges, createRecipeChange } from '@/api/recipeChanges.js';

export const useRecipeChangesStore = defineStore('recipeChanges', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async loadRecipeChanges(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                this.list = await fetchRecipeChanges(filters);
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao carregar alterações de receita.';
            } finally {
                this.loading = false;
            }
        },

        async addRecipeChange(payload) {
            this.error = null;
            try {
                const created = await createRecipeChange(payload);
                this.list.unshift(created);
                return created;
            } catch (err) {
                console.error(err);
                this.error = 'Erro ao criar alteração de receita.';
                throw err;
            }
        },
    },
});
