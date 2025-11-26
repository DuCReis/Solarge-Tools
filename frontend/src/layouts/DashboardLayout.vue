<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex">

    <!-- Sidebar fixa -->
    <Sidebar
        class="w-64 border-r border-slate-800 bg-slate-900"
    />

    <!-- Conteúdo principal -->
    <main class="flex-1 flex flex-col bg-slate-900 min-h-screen">

      <!-- Header superior -->
      <header
          class="px-6 py-4 border-b border-slate-800 flex items-center justify-between"
      >
        <div>
          <h1 class="text-lg font-semibold">
            {{ currentTitle }}
          </h1>
          <p class="text-xs text-slate-400">
            {{ currentSubtitle }}
          </p>
        </div>

        <!-- Botão de logout -->
        <button
            @click="logoutNow"
            class="text-sm px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      <!-- Onde as views aparecem -->
      <section class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </section>

    </main>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useRoute, useRouter, RouterView} from 'vue-router';
import Sidebar from '@/components/layout/Sidebar.vue';
import {useAuthStore} from '@/stores/authStore.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// Título/subtítulo vindos das meta info das rotas
const currentTitle = computed(() => route.meta?.title || 'Dashboard');
const currentSubtitle = computed(
    () => route.meta?.subtitle || 'Machine data capture & analytics'
);

function logoutNow() {
  auth.logout();
  router.push({name: 'login'});
}
</script>
