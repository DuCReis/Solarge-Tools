<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950">
    <div class="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">
      <h1 class="text-xl font-bold mb-1">Login</h1>
      <p class="text-xs text-slate-400 mb-4">
        Acede ao sistema interno de registo de dados.
      </p>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-xs mb-1">Email</label>
          <input
              v-model="email"
              type="email"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
          />
        </div>

        <div>
          <label class="block text-xs mb-1">Password</label>
          <input
              v-model="password"
              type="password"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
          />
        </div>

        <p v-if="error" class="text-xs text-red-400">
          {{ error }}
        </p>

        <button
            type="submit"
            class="w-full py-2 text-sm font-medium rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
            :disabled="loading"
        >
          <span v-if="loading">A autenticar...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const authStore = useAuthStore();
const router = useRouter();

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'home' });
  } catch (err) {
    console.error(err);
    error.value = 'Credenciais inválidas ou erro no servidor.';
  } finally {
    loading.value = false;
  }
}
</script>
