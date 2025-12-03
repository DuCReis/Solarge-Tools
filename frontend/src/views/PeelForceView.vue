<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-zinc-50">Peel Force</h1>
        <p class="text-sm text-zinc-400">
          Registration and analysis of peel force tests per machine and cell type.
        </p>
      </div>

      <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-zinc-700
               bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm
               hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          @click="openForm"
      >
        + New test
      </button>
    </header>

    <!-- Filters -->
    <section
        class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-sm shadow-black/30"
    >
      <h2 class="mb-3 text-sm font-semibold text-zinc-200">Filters</h2>
      <div class="grid gap-3 md:grid-cols-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-400">Machine</label>
          <select
              v-model="filters.machineId"
              class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                   text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All</option>
            <option
                v-for="m in machines"
                :key="m.id"
                :value="m.id"
            >
              {{ m.name ?? `Machine #${m.id}` }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-400">From</label>
          <input
              v-model="filters.from"
              type="date"
              class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                   text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-400">To</label>
          <input
              v-model="filters.to"
              type="date"
              class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                   text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div class="flex items-end">
          <button
              type="button"
              class="inline-flex w-full items-center justify-center rounded-lg
                   bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950
                   shadow-sm hover:bg-emerald-400 focus:outline-none
                   focus:ring-2 focus:ring-emerald-500"
              @click="applyFilters"
          >
            Apply filters
          </button>
        </div>
      </div>
    </section>

    <!-- Summary -->
    <section class="grid gap-4 md:grid-cols-4">
      <div
          class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-200"
      >
        <div class="text-xs text-zinc-400">Total tests</div>
        <div class="mt-1 text-2xl font-semibold">
          {{ stats.count }}
        </div>
      </div>

      <div
          class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-200"
      >
        <div class="text-xs text-zinc-400">Average peel force (N)</div>
        <div class="mt-1 text-2xl font-semibold">
          {{ stats.avg ? stats.avg.toFixed(2) : '-' }}
        </div>
      </div>

      <div
          class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-200"
      >
        <div class="text-xs text-zinc-400">Minimum (N)</div>
        <div class="mt-1 text-2xl font-semibold">
          {{ stats.min != null ? stats.min.toFixed(2) : '-' }}
        </div>
      </div>

      <div
          class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-200"
      >
        <div class="text-xs text-zinc-400">Maximum (N)</div>
        <div class="mt-1 text-2xl font-semibold">
          {{ stats.max != null ? stats.max.toFixed(2) : '-' }}
        </div>
      </div>
    </section>

    <!-- Table -->
    <section
        class="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-sm shadow-black/30"
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <h2 class="text-sm font-semibold text-zinc-200">Registered peel force tests</h2>
        <span v-if="loading" class="text-xs text-zinc-400">Loading…</span>
      </div>

      <div
          v-if="error"
          class="mb-3 rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-100"
      >
        {{ error }}
      </div>

      <div
          v-if="!loading && !list.length"
          class="rounded-lg bg-zinc-900/80 px-4 py-6 text-sm text-zinc-400"
      >
        No peel force tests found for these filters.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-xs">
          <thead class="border-b border-zinc-800 text-zinc-400">
          <tr>
            <th class="px-3 py-2 font-medium">Test date</th>
            <th class="px-3 py-2 font-medium">Machine</th>
            <th class="px-3 py-2 font-medium">Cell type</th>
            <th class="px-3 py-2 font-medium">Ribbon</th>
            <th class="px-3 py-2 font-medium">Flux</th>
            <th class="px-3 py-2 font-medium">Peel force (N)</th>
            <th class="px-3 py-2 font-medium">Description</th>
            <th class="px-3 py-2 font-medium">Notes</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-900 text-zinc-100">
          <tr
              v-for="row in list"
              :key="row.id"
              class="hover:bg-zinc-900/60 cursor-pointer"
              @click="goToDetail(row)"
          >
          <td class="px-3 py-2">
              {{ formatDate(row.measurementDatetime ?? row.measurement_datetime) }}
            </td>
            <td class="px-3 py-2">
              {{ row.Machine?.name ?? row.machineName ?? `#${row.machineId ?? row.machine_id}` }}
            </td>
            <td class="px-3 py-2">
              {{ row.cellType ?? row.cell_type ?? '-' }}
            </td>
            <td class="px-3 py-2">
              <div class="flex flex-col">
                <span>{{ row.ribbonType ?? row.ribbon_type ?? '-' }}</span>
                <span
                    v-if="row.ribbonBatch ?? row.ribbon_batch"
                    class="text-[10px] text-zinc-400"
                >
                    Batch: {{ row.ribbonBatch ?? row.ribbon_batch }}
                  </span>
              </div>
            </td>
            <td class="px-3 py-2">
              {{ row.fluxType ?? row.flux_type ?? '-' }}
            </td>
            <td class="px-3 py-2 font-semibold">
              {{
                (row.valueN ?? row.value_n)?.toFixed
                    ? (row.valueN ?? row.value_n).toFixed(2)
                    : row.valueN ?? row.value_n
              }}
            </td>
            <td class="px-3 py-2 max-w-xs">
                <span class="text-[11px] text-zinc-300">
                  Test on
                  {{ formatDate(row.measurementDatetime ?? row.measurement_datetime) }}
                  · Machine:
                  {{ row.Machine?.name ?? row.machineName ?? `#${row.machineId ?? row.machine_id}` }}
                  · Cell:
                  {{ row.cellType ?? row.cell_type ?? '-' }}
                  · Ribbon:
                  {{ row.ribbonType ?? row.ribbon_type ?? '-' }}
                  · Flux:
                  {{ row.fluxType ?? row.flux_type ?? '-' }}
                </span>
            </td>
            <td class="px-3 py-2 max-w-xs">
                <span class="line-clamp-2 text-[11px] text-zinc-300">
                  {{ row.operatorNotes ?? row.operator_notes ?? '' }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- New test form with grid -->
    <section
        v-if="formOpen"
        class="rounded-2xl border border-emerald-700/60 bg-zinc-950/90 p-4 shadow-md shadow-emerald-900/40"
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <h2 class="text-sm font-semibold text-zinc-100">
          New Peel Force test (Ribbon 1 / 5 / 10 · Front &amp; Back)
        </h2>
        <button
            type="button"
            class="text-xs text-zinc-400 hover:text-zinc-200"
            @click="formOpen = false"
        >
          Close
        </button>
      </div>

      <div
          v-if="formError"
          class="mb-3 rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-100"
      >
        {{ formError }}
      </div>

      <!-- Test meta -->
      <form
          class="space-y-4"
          @submit.prevent="submitForm"
      >
        <div class="grid gap-3 md:grid-cols-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Machine *</label>
            <select
                v-model="formMeta.machineId"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
            >
              <option value="" disabled>Select a machine</option>
              <option
                  v-for="m in machines"
                  :key="m.id"
                  :value="m.id"
              >
                {{ m.name ?? `Machine #${m.id}` }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Test date</label>
            <input
                v-model="formMeta.measurementDatetime"
                type="datetime-local"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Cell type</label>
            <input
                v-model="formMeta.cellType"
                type="text"
                placeholder="PERC, TOPCon, etc."
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Ribbon type</label>
            <input
                v-model="formMeta.ribbonType"
                type="text"
                placeholder="0.5 x 0.2 mm"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Ribbon batch</label>
            <input
                v-model="formMeta.ribbonBatch"
                type="text"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Flux type</label>
            <input
                v-model="formMeta.fluxType"
                type="text"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Warehouse temperature (°C)</label>
            <input
                v-model.number="formMeta.warehouseTemperature"
                type="number"
                step="0.1"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Machine temperature (°C)</label>
            <input
                v-model.number="formMeta.machineTemperature"
                type="number"
                step="0.1"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-zinc-400">Machine vacuum</label>
            <input
                v-model.number="formMeta.machineVacuum"
                type="number"
                step="0.01"
                placeholder="-0.95"
                class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                     text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-zinc-400">Notes</label>
          <textarea
              v-model="formMeta.operatorNotes"
              rows="2"
              class="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
                   text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- GRID FRONT -->
        <div class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Front (top side of the cell) — 14 points per ribbon
          </h3>
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
                  v-for="row in frontGrid"
                  :key="`front-row-${row.ribbonNumber}`"
              >
                <td class="px-2 py-1 font-medium">
                  {{ row.label }}
                </td>
                <td
                    v-for="(val, idx) in row.points"
                    :key="`front-${row.ribbonNumber}-${idx}`"
                    class="px-1 py-1"
                >
                  <input
                      v-model.number="row.points[idx]"
                      type="number"
                      step="0.01"
                      class="w-16 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-[11px]
                             text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- GRID BACK -->
        <div class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Back (bottom side of the cell) — 14 points per ribbon
          </h3>
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
                  v-for="row in backGrid"
                  :key="`back-row-${row.ribbonNumber}`"
              >
                <td class="px-2 py-1 font-medium">
                  {{ row.label }}
                </td>
                <td
                    v-for="(val, idx) in row.points"
                    :key="`back-${row.ribbonNumber}-${idx}`"
                    class="px-1 py-1"
                >
                  <input
                      v-model.number="row.points[idx]"
                      type="number"
                      step="0.01"
                      class="w-16 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-[11px]
                             text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
              type="button"
              class="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium
                   text-zinc-200 hover:bg-zinc-900"
              @click="formOpen = false"
          >
            Cancel
          </button>
          <button
              type="submit"
              :disabled="formSubmitting"
              class="inline-flex items-center justify-center rounded-lg bg-emerald-500
                   px-4 py-2 text-xs font-semibold text-zinc-950 shadow-sm
                   hover:bg-emerald-400 disabled:opacity-60"
          >
            <span v-if="!formSubmitting">Save test</span>
            <span v-else>Saving…</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePeelForceStore } from '@/stores/peelForceStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const peelStore = usePeelForceStore();
const { list, loading, error } = storeToRefs(peelStore);

const machinesStore = useMachinesStore();
const { list: machines } = storeToRefs(machinesStore);

const router = useRouter();

function goToDetail(row) {
  router.push({
    name: 'peel-force-detail',
    params: { id: row.id },
  });
}


// filters
const filters = ref({
  machineId: '',
  from: '',
  to: '',
});

// peel force test meta
const formOpen = ref(false);
const formSubmitting = ref(false);
const formError = ref('');

const formMeta = ref({
  machineId: '',
  ribbonType: '',
  ribbonBatch: '',
  fluxType: '',
  cellType: '',
  measurementDatetime: '',
  warehouseTemperature: '',
  machineTemperature: '',
  machineVacuum: '',
  operatorNotes: '',
});

// ribbons and points
const RIBBONS = [
  { label: 'Ribbon 1', ribbonNumber: 1 },
  { label: 'Ribbon 5', ribbonNumber: 5 },
  { label: 'Ribbon 10', ribbonNumber: 10 },
];
const POINTS = Array.from({ length: 14 }, (_, i) => i + 1);

// grid values (front / back)
const frontGrid = ref(
    RIBBONS.map((r) => ({
      ribbonNumber: r.ribbonNumber,
      label: r.label,
      points: POINTS.map(() => ''),
    })),
);

const backGrid = ref(
    RIBBONS.map((r) => ({
      ribbonNumber: r.ribbonNumber,
      label: r.label,
      points: POINTS.map(() => ''),
    })),
);

onMounted(async () => {
  await machinesStore.loadMachines();
  await peelStore.loadPeelForce();
});

// summary stats
const stats = computed(() => {
  const items = list.value || [];
  const values = items
      .map((it) => Number(it.valueN ?? it.value_n))
      .filter((v) => !Number.isNaN(v));

  if (!values.length) {
    return {
      count: items.length,
      avg: 0,
      min: null,
      max: null,
    };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    count: items.length,
    avg,
    min,
    max,
  };
});

async function applyFilters() {
  await peelStore.loadPeelForce({
    machineId: filters.value.machineId || undefined,
    from: filters.value.from || undefined,
    to: filters.value.to || undefined,
  });
}

function openForm() {
  formOpen.value = true;
  formError.value = '';
}

function resetForm() {
  formMeta.value = {
    machineId: '',
    ribbonType: '',
    ribbonBatch: '',
    fluxType: '',
    cellType: '',
    measurementDatetime: '',
    warehouseTemperature: '',
    machineTemperature: '',
    machineVacuum: '',
    operatorNotes: '',
  };

  frontGrid.value = RIBBONS.map((r) => ({
    ribbonNumber: r.ribbonNumber,
    label: r.label,
    points: POINTS.map(() => ''),
  }));
  backGrid.value = RIBBONS.map((r) => ({
    ribbonNumber: r.ribbonNumber,
    label: r.label,
    points: POINTS.map(() => ''),
  }));
}

async function submitForm() {
  formError.value = '';
  formSubmitting.value = true;

  try {
    const meta = { ...formMeta.value };

    if (!meta.machineId) {
      formError.value = 'Select a machine.';
      formSubmitting.value = false;
      return;
    }

    // Montar o objeto measurements no formato:
    // {
    //   front: { "1": [14], "5": [14], "10": [14] },
    //   back:  { "1": [14], "5": [14], "10": [14] }
    // }
    const measurements = {
      front: {},
      back: {},
    };

    // FRONT
    for (const row of frontGrid.value) {
      const key = String(row.ribbonNumber); // "1", "5", "10"
      measurements.front[key] = row.points.map((val) => {
        if (val === '' || val == null) return null;
        const num = Number(val);
        return Number.isNaN(num) ? null : num;
      });
    }

    // BACK
    for (const row of backGrid.value) {
      const key = String(row.ribbonNumber); // "1", "5", "10"
      measurements.back[key] = row.points.map((val) => {
        if (val === '' || val == null) return null;
        const num = Number(val);
        return Number.isNaN(num) ? null : num;
      });
    }

    // Verificar se há pelo menos um valor numérico
    const allValues = [
      ...Object.values(measurements.front).flat(),
      ...Object.values(measurements.back).flat(),
    ].filter((v) => typeof v === 'number');

    if (!allValues.length) {
      formError.value = 'Fill at least one peel force value.';
      formSubmitting.value = false;
      return;
    }

    const payload = {
      machineId: meta.machineId,
      ribbonType: meta.ribbonType,
      ribbonBatch: meta.ribbonBatch,
      fluxType: meta.fluxType,
      cellType: meta.cellType,
      measurementDatetime: meta.measurementDatetime,
      warehouseTemperature: meta.warehouseTemperature,
      machineTemperature: meta.machineTemperature,
      machineVacuum: meta.machineVacuum,
      operatorNotes: meta.operatorNotes,
      measurements, // 👈 agora é o objeto correto
    };

    // se não escolheres data, backend assume "agora"
    if (!payload.measurementDatetime) {
      delete payload.measurementDatetime;
    }

    await peelStore.addPeelForce(payload);
    resetForm();
    formOpen.value = false;
  } catch (err) {
    console.error(err);
    formError.value = 'Error while saving peel force test. Please check the fields.';
  } finally {
    formSubmitting.value = false;
  }
}


function formatDate(raw) {
  const d = raw ? new Date(raw) : null;
  if (!d || Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString();
}
</script>
