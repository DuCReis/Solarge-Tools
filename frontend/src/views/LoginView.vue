<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-xl">
      <h1 class="text-2xl font-bold mb-6 text-center">Stringer Analytics</h1>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input
              v-model="email"
              type="email"
              class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
              autocomplete="email"
              required
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
              v-model="password"
              type="password"
              class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
              autocomplete="current-password"
              required
          />
        </div>

        <p v-if="error" class="text-sm text-red-400">
          {{ error }}
        </p>

        <button
            type="submit"
            class="w-full mt-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm disabled:opacity-60"
            :disabled="loading"
        >
          {{ loading ? 'A entrar...' : 'Entrar' }}
        </button>

        <p class="mt-3 text-xs text-slate-400">
          Para desenvolvimento podes usar:<br />
          <span class="font-mono">admin@example.com / admin123</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';

const router = useRouter();
const auth = useAuthStore();

const email = ref('admin@example.com');
const password = ref('admin123');
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';

  try {
    await auth.login(email.value, password.value);

    // ⬇️ ESTA LINHA É A IMPORTANTE
    await router.push({ name: 'dashboard' }); // ou '/dashboard'
  } catch (err) {
    console.error(err);
    error.value = auth.error || 'Credenciais inválidas ou erro no servidor.';
  } finally {
    loading.value = false;
  }
}
</script>

