<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <button
            type="button"
            class="mb-2 inline-flex items-center text-xs text-zinc-400 hover:text-zinc-200"
            @click="goBack"
        >
          ← Back to peel force list
        </button>
        <h1 class="text-xl font-semibold text-zinc-50">
          Peel Force test details
        </h1>
        <p class="text-sm text-zinc-400">
          Full grid and statistics for this peel force test.
        </p>
      </div>

      <div class="text-right text-xs text-zinc-400">
        <div>ID: {{ id }}</div>
        <div v-if="loading">Loading…</div>
      </div>
    </header>

    <div
        v-if="error"
        class="rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-100"
    >
      {{ error }}
    </div>

    <div v-if="!current && !loading" class="text-sm text-zinc-400">
      Test not found.
    </div>

    <template v-else-if="current">
      <!-- Meta -->
      <section class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
          <div class="text-xs text-zinc-400">Test date</div>
          <div class="mt-1 text-base text-zinc-100">
            {{ formatDate(current.measurementDatetime ?? current.measurement_datetime) }}
          </div>
        </div>

        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
          <div class="text-xs text-zinc-400">Machine</div>
          <div class="mt-1 text-base text-zinc-100">
            {{ current.Machine?.name ?? current.machineName ?? `#${current.machineId ?? current.machine_id}` }}
          </div>
          <div
              v-if="current.machine_temperature ?? current.machineTemperature"
              class="mt-1 text-xs text-zinc-400"
          >
            Machine temp:
            {{ current.machineTemperature ?? current.machine_temperature }} °C
          </div>
          <div
              v-if="current.machine_vacuum ?? current.machineVacuum"
              class="mt-1 text-xs text-zinc-400"
          >
            Vacuum:
            {{ current.machineVacuum ?? current.machine_vacuum }}
          </div>
        </div>

        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
          <div class="text-xs text-zinc-400">Cell / ribbon / flux</div>
          <div class="mt-1 text-xs text-zinc-300">
            Cell type:
            <span class="font-semibold">
              {{ current.cellType ?? current.cell_type ?? '-' }}
            </span>
          </div>
          <div class="mt-1 text-xs text-zinc-300">
            Ribbon:
            <span class="font-semibold">
              {{ current.ribbonType ?? current.ribbon_type ?? '-' }}
            </span>
            <span
                v-if="current.ribbonBatch ?? current.ribbon_batch"
                class="ml-1 text-[10px] text-zinc-400"
            >
              (Batch: {{ current.ribbonBatch ?? current.ribbon_batch }})
            </span>
          </div>
          <div class="mt-1 text-xs text-zinc-300">
            Flux:
            <span class="font-semibold">
              {{ current.fluxType ?? current.flux_type ?? '-' }}
            </span>
          </div>
          <div
              v-if="current.warehouseTemperature ?? current.warehouse_temperature"
              class="mt-1 text-xs text-zinc-400"
          >
            Warehouse temp:
            {{ current.warehouseTemperature ?? current.warehouse_temperature }} °C
          </div>
        </div>
      </section>

      <!-- Averages -->
      <section class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
          <h2 class="mb-2 text-sm font-semibold text-zinc-100">Front averages</h2>
          <ul class="space-y-1 text-xs text-zinc-300">
            <li v-for="r in RIBBON_KEYS" :key="`front-avg-${r}`">
              Ribbon {{ r }}:
              <span class="font-semibold">
                {{
                  frontStats.ribbonAverages[r] != null
                      ? frontStats.ribbonAverages[r].toFixed(2)
                      : '-'
                }}
                N
              </span>
            </li>
            <li class="mt-2 text-zinc-200">
              Total front average:
              <span class="font-semibold">
                {{ frontStats.total != null ? frontStats.total.toFixed(2) : '-' }} N
              </span>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
          <h2 class="mb-2 text-sm font-semibold text-zinc-100">Back averages</h2>
          <ul class="space-y-1 text-xs text-zinc-300">
            <li v-for="r in RIBBON_KEYS" :key="`back-avg-${r}`">
              Ribbon {{ r }}:
              <span class="font-semibold">
                {{
                  backStats.ribbonAverages[r] != null
                      ? backStats.ribbonAverages[r].toFixed(2)
                      : '-'
                }}
                N
              </span>
            </li>
            <li class="mt-2 text-zinc-200">
              Total back average:
              <span class="font-semibold">
                {{ backStats.total != null ? backStats.total.toFixed(2) : '-' }} N
              </span>
            </li>
          </ul>
        </div>
      </section>

      <!-- FRONT GRID -->
      <section
          class="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
      >
        <h2 class="text-sm font-semibold text-zinc-100">
          Front side — full grid (14 points per ribbon)
        </h2>
        <div class="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
          <table class="min-w-full text-[11px] text-zinc-100">
            <thead>
            <tr>
              <th class="px-2 py-1 text-left font-medium">Ribbon</th>
              <th
                  v-for="p in POINTS"
                  :key="`front-head-${p}`"
                  class="px-2 py-1 text-center font-medium"
              >
                {{ p }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="row in frontRows"
                :key="`front-row-${row.ribbon}`"
            >
              <td class="px-2 py-1 font-medium">
                {{ row.label }}
              </td>
              <td
                  v-for="(val, idx) in row.values"
                  :key="`front-${row.ribbon}-${idx}`"
                  class="px-1 py-1 text-center"
              >
                {{ val != null ? val.toFixed(2) : '-' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- BACK GRID -->
      <section
          class="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
      >
        <h2 class="text-sm font-semibold text-zinc-100">
          Back side — full grid (14 points per ribbon)
        </h2>
        <div class="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
          <table class="min-w-full text-[11px] text-zinc-100">
            <thead>
            <tr>
              <th class="px-2 py-1 text-left font-medium">Ribbon</th>
              <th
                  v-for="p in POINTS"
                  :key="`back-head-${p}`"
                  class="px-2 py-1 text-center font-medium"
              >
                {{ p }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="row in backRows"
                :key="`back-row-${row.ribbon}`"
            >
              <td class="px-2 py-1 font-medium">
                {{ row.label }}
              </td>
              <td
                  v-for="(val, idx) in row.values"
                  :key="`back-${row.ribbon}-${idx}`"
                  class="px-1 py-1 text-center"
              >
                {{ val != null ? val.toFixed(2) : '-' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Notes -->
      <section
          v-if="current.operatorNotes ?? current.operator_notes"
          class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-200"
      >
        <h2 class="mb-2 text-sm font-semibold text-zinc-100">Notes</h2>
        <p class="text-xs text-zinc-300">
          {{ current.operatorNotes ?? current.operator_notes }}
        </p>
      </section>
    </template>
  </div>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {usePeelForceStore} from '@/stores/peelForceStore.js';

const route = useRoute();
const router = useRouter();
const peelStore = usePeelForceStore();
const {current, loading, error} = storeToRefs(peelStore);

const id = computed(() => route.params.id);

onMounted(async () => {
  try {
    await peelStore.loadPeelForceById(id.value);
  } catch (e) {
    console.error(e);
  }
});

// tenta encontrar o campo onde está o grid e fazer parse se vier como string
const grid = computed(() => {
  const rec = current.value;
  if (!rec) return null;

  let g = rec.measurements || rec.grid_data || rec.gridData || null;
  if (!g) return null;

  // se vier como string JSON da API, faz parse
  if (typeof g === 'string') {
    try {
      g = JSON.parse(g);
    } catch (err) {
      console.error('Failed to parse grid_data JSON:', err);
      return null;
    }
  }

  return g;
});

const RIBBON_KEYS = ['1', '5', '10'];
const POINTS = Array.from({length: 14}, (_, i) => i + 1);

function makeRows(side) {
  const g = grid.value;
  if (!g || !g[side]) return [];

  return RIBBON_KEYS.map((key) => {
    const arr = g[side][key] || [];
    const values = Array.from({length: 14}, (_, idx) => {
      const v = arr[idx];
      if (v === null || v === undefined) return null;
      const num = Number(v);
      return Number.isNaN(num) ? null : num;
    });

    return {
      ribbon: key,
      label: `Ribbon ${key}`,
      values,
    };
  });
}

const frontRows = computed(() => makeRows('front'));
const backRows = computed(() => makeRows('back'));

function avg(arr) {
  const nums = (arr || []).filter(
      (v) => typeof v === 'number' && !Number.isNaN(v),
  );
  if (!nums.length) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

const frontStats = computed(() => {
  const rows = frontRows.value;
  const ribbonAverages = {};
  let all = [];
  rows.forEach((r) => {
    const a = avg(r.values);
    ribbonAverages[r.ribbon] = a;
    all = all.concat(r.values.filter((v) => typeof v === 'number'));
  });
  return {
    ribbonAverages,
    total: avg(all),
  };
});

const backStats = computed(() => {
  const rows = backRows.value;
  const ribbonAverages = {};
  let all = [];
  rows.forEach((r) => {
    const a = avg(r.values);
    ribbonAverages[r.ribbon] = a;
    all = all.concat(r.values.filter((v) => typeof v === 'number'));
  });
  return {
    ribbonAverages,
    total: avg(all),
  };
});

function formatDate(raw) {
  const d = raw ? new Date(raw) : null;
  if (!d || Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString();
}

function goBack() {
  router.push({name: 'peel-force'});
}
</script>
