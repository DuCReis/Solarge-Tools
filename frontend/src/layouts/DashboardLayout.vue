<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex">
    <!-- Sidebar fixa -->
    <Sidebar />

    <!-- Conteúdo principal -->
    <main class="flex-1 flex flex-col min-h-screen bg-slate-900">
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
      </header>

      <!-- Área das views -->
      <section class="flex-1 overflow-y-auto">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Sidebar from '@/components/layout/Sidebar.vue';

const route = useRoute();

const currentTitle = computed(() => route.meta?.title || 'Dashboard');
const currentSubtitle = computed(
    () => route.meta?.subtitle || 'Machine data capture & analysis'
);
</script>
