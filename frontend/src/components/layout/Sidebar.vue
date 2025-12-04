<template>
  <aside
      class="w-60 bg-slate-950 border-r border-slate-800 min-h-screen flex flex-col"
  >
    <!-- Logo / título -->
    <div class="px-4 py-4 border-b border-slate-800">
      <h1 class="text-base font-semibold text-slate-100">
        Stringer Analytics
      </h1>
      <p class="text-[11px] text-slate-400">
        Solarge · Internal tools
      </p>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-2 py-4 space-y-1 text-sm">
      <RouterLink
          v-for="item in menu"
          :key="item.name"
          :to="item.to"
          class="flex items-center gap-2 px-3 py-2 rounded-md"
          :class="
          isActive(item)
            ? 'bg-slate-800 text-slate-50 font-medium'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        "
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- User + logout -->
    <div class="border-t border-slate-800 px-3 py-3 text-xs text-slate-400">
      <div class="flex items-center justify-between mb-2">
        <span>{{ auth.user?.name || 'Admin' }}</span>
        <span
            class="text-[10px] uppercase tracking-wide bg-slate-800 px-2 py-0.5 rounded"
        >
          {{ auth.user?.role || 'ADMIN' }}
        </span>
      </div>
      <button
          class="w-full text-left text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2 py-1 rounded"
          @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const menu = [
  { name: 'dashboard',         label: 'Dashboard',          to: { name: 'dashboard' } },
  { name: 'peel-force',        label: 'Peel Force',         to: { name: 'peel-force' } },
  { name: 'string-rejections', label: 'String rejections',  to: { name: 'string-rejections' } },
  { name: 'snapshots',         label: 'Machine snapshots',  to: { name: 'snapshots' } },
  { name: 'recipe-changes',    label: 'Recipe changes',     to: { name: 'recipe-changes' } },
  { name: 'maintenance',       label: 'Maintenance / Logs', to: { name: 'maintenance' } },
  { name: 'ribbon-spools',     label: 'Ribbon spools',      to: { name: 'ribbon-spools' } },
];


function isActive(item) {
  return route.name === item.name;
}

async function handleLogout() {
  auth.logout?.(); // se tiveres logout no store
  await router.push({ name: 'login' });
}
</script>
