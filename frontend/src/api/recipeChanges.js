// frontend/src/api/recipeChanges.js
import api from './axios.js';

export async function fetchRecipeChanges(params = {}) {
    const { data } = await api.get('/recipe-changes', { params });
    return data;
}

export async function createRecipeChange(payload) {
    const { data } = await api.post('/recipe-changes', payload);
    return data;
}
