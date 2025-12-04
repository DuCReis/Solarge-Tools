<template>
  <div class="p-6 space-y-6">
    <!-- Título + descrição -->
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-slate-400">
        Visão geral do desempenho das máquinas (stringer / layup) e eventos registados.
      </p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
        <p class="text-xs text-slate-400 uppercase tracking-wide">Máquinas registadas</p>
        <p class="mt-2 text-3xl font-semibold">
          {{ machinesCount }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          Stringers, layups e outras máquinas configuradas.
        </p>
      </div>

      <div class="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
        <p class="text-xs text-slate-400 uppercase tracking-wide">Medições Peel Force</p>
        <p class="mt-2 text-3xl font-semibold">
          {{ peelCount }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          Últimos registos carregados do backend.
        </p>
      </div>

      <div class="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
        <p class="text-xs text-slate-400 uppercase tracking-wide">String rejections</p>
        <p class="mt-2 text-3xl font-semibold">
          {{ rejectionsCount }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          Inclui MC, UPS, RM, BC, Good rejected, etc.
        </p>
      </div>
    </div>

    <!-- Últimos eventos agregados -->
    <div class="rounded-lg border border-slate-700 bg-slate-900/70">
      <div class="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <h2 class="text-sm font-semibold">Últimos eventos / medições</h2>
        <span class="text-[11px] text-slate-400">
          Dados agregados de peel force, rejections e layup events
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-900/90">
          <tr>
            <th class="p-2 text-left">Datetime</th>
            <th class="p-2 text-left">Tipo</th>
            <th class="p-2 text-left">Máquina</th>
            <th class="p-2 text-left">Detalhe</th>
            <th class="p-2 text-left">Operador</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in lastEvents"
              :key="item.key"
              class="border-t border-slate-700 hover:bg-slate-800/60"
          >
            <td class="p-2">
              {{ formatDateTime(item.datetime) }}
            </td>
            <td class="p-2">
                <span
                    class="px-2 py-0.5 rounded text-[11px] font-medium"
                    :class="badgeClass(item.kind)"
                >
                  {{ item.kindLabel }}
                </span>
            </td>
            <td class="p-2">
              {{ item.machineCode }} <span class="text-slate-400">{{ item.machineName }}</span>
            </td>
            <td class="p-2">
              {{ item.description }}
            </td>
            <td class="p-2">
              {{ item.operatorName || '-' }}
            </td>
          </tr>

          <tr v-if="!lastEvents.length">
            <td colspan="5" class="p-4 text-center text-slate-400 text-sm">
              Ainda não há dados suficientes. Regista peel force, rejections ou layup events.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useMachinesStore } from '@/stores/machinesStore.js';
import { usePeelForceStore } from '@/stores/peelForceStore.js';
import { useRejectionsStore } from '@/stores/stringRejectionsStore.js';
import {useAuthStore} from "@/stores/authStore.js";

const machinesStore = useMachinesStore();
const peelStore = usePeelForceStore();
const rejectionsStore = useRejectionsStore();

// KPIs simples
const machinesCount = computed(() => machinesStore.list.length || 0);
const peelCount = computed(() => peelStore.list.length || 0);
const rejectionsCount = computed(() => rejectionsStore.list.length || 0);

const auth = useAuthStore();

// Normalização de eventos para uma lista comum
const lastEvents = computed(() => {
  const items = [];

  // Peel force
  for (const m of peelStore.list) {
    items.push({
      key: `peel-${m.id}`,
      kind: 'PEEL',
      kindLabel: 'Peel force',
      datetime: m.measurement_datetime || m.measurementDatetime || m.createdAt,
      machineCode: m.Machine?.code || '',
      machineName: m.Machine?.name || '',
      operatorName: m.User?.name || null,
      description: `${m.value_n ?? m.valueN} N` +
          (m.zone ? ` · ${m.zone}` : '') +
          (m.cell_type || m.cellType ? ` · ${m.cell_type || m.cellType}` : ''),
    });
  }

  // String rejections
  for (const r of rejectionsStore.list) {
    items.push({
      key: `rej-${r.id}`,
      kind: 'REJECTION',
      kindLabel: 'String rejection',
      datetime: r.createdAt,
      machineCode: r.Machine?.code || '',
      machineName: r.Machine?.name || '',
      operatorName: r.User?.name || null,
      description: `${r.category} (${r.source})` + (r.side ? ` · ${r.side}` : ''),
    });
  }

  // Ordenar por datetime desc e limitar a 20
  return items
      .filter((i) => i.datetime)
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
      .slice(0, 20);
});

function formatDateTime(val) {
  if (!val) return '-';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleString();
}

function badgeClass(kind) {
  switch (kind) {
    case 'PEEL':
      return 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60';
    case 'REJECTION':
      return 'bg-red-900/60 text-red-300 border border-red-700/60';
    case 'LAYUP':
      return 'bg-amber-900/60 text-amber-300 border border-amber-700/60';
    default:
      return 'bg-slate-800 text-slate-200 border border-slate-600';
  }
}

// Carregar dados na entrada da dashboard
onMounted(async () => {
  if (!auth.isAuthenticated) {
    return;
  }
  // Não forço filtros, só busco "default" (últimos registos)
  if (!machinesStore.list.length) {
    await machinesStore.loadMachines();
  }

  // Se quiseres podes passar params (ex.: últimos X dias),
  // mas para já chamamos sem filtros:
  if (!peelStore.list.length) {
    await peelStore.loadPeelForce({});
  }
  if (!rejectionsStore.list.length) {
    await rejectionsStore.loadRejections({});
  }
});
</script>
