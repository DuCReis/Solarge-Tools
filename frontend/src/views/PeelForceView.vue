<!-- frontend/src/views/PeelForceView.vue -->
<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Peel Force Measurements</h1>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="showForm = true">
        + Nova Medição
      </button>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-800/40 p-4 rounded-lg">
      <select
          v-model="filters.machineId"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      >
        <option value="">Máquina</option>
        <option v-for="m in machinesStore.list" :key="m.id" :value="m.id">
          {{ m.code }} - {{ m.name }}
        </option>
      </select>

      <select
          v-model="filters.cellType"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="applyLocalFilter"
      >
        <option value="">Cell type</option>
        <option value="PERC">PERC</option>
        <option value="TOPCON">TOPCON</option>
      </select>

      <select
          v-model="filters.zone"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="applyLocalFilter"
      >
        <option value="">Zone</option>
        <option value="TOP">TOP</option>
        <option value="MIDDLE">MIDDLE</option>
        <option value="BOTTOM">BOTTOM</option>
      </select>

      <input
          v-model="filters.from"
          type="date"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      />

      <input
          v-model="filters.to"
          type="date"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      />
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto border border-slate-700 rounded-lg">
      <table class="w-full text-sm">
        <thead class="bg-slate-900/80">
        <tr>
          <th class="p-2 text-left">Data/Hora</th>
          <th class="p-2 text-left">Máquina</th>
          <th class="p-2 text-right">Peel (N)</th>
          <th class="p-2 text-left">Cell type</th>
          <th class="p-2 text-left">Zone</th>
          <th class="p-2 text-left">Ribbon type</th>
          <th class="p-2 text-left">Ribbon batch</th>
          <th class="p-2 text-left">Flux</th>
          <th class="p-2 text-left">Operador</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="m in filteredList"
            :key="m.id"
            class="border-t border-slate-700 hover:bg-slate-800/60"
        >
          <td class="p-2">
            {{ formatDateTime(m.measurement_datetime || m.measurementDatetime) }}
          </td>
          <td class="p-2">
            {{ m.Machine?.code }} - {{ m.Machine?.name }}
          </td>
          <td class="p-2 text-right font-semibold">
            {{ m.value_n?.toFixed?.(2) ?? m.value_n ?? m.valueN }}
          </td>
          <td class="p-2">
            {{ m.cell_type || m.cellType || '-' }}
          </td>
          <td class="p-2">
            {{ m.zone || '-' }}
          </td>
          <td class="p-2">
            {{ m.ribbon_type || m.ribbonType || '-' }}
          </td>
          <td class="p-2">
            {{ m.ribbon_batch || m.ribbonBatch || '-' }}
          </td>
          <td class="p-2">
            {{ m.flux_type || m.fluxType || '-' }}
          </td>
          <td class="p-2">
            {{ m.User?.name || '-' }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: nova medição -->
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 rounded-lg shadow-xl w-full max-w-xl p-6 space-y-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold">Nova Medição de Peel Force</h2>
          <button class="text-slate-400 hover:text-white" @click="closeForm">✕</button>
        </div>

        <form @submit.prevent="submitPeelForce" class="space-y-3 text-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block mb-1">Máquina *</label>
              <select
                  v-model="form.machineId"
                  required
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">Selecionar</option>
                <option v-for="m in machinesStore.list" :key="m.id" :value="m.id">
                  {{ m.code }} - {{ m.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Datetime</label>
              <input
                  v-model="form.measurementDatetime"
                  type="datetime-local"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Peel force (N) *</label>
              <input
                  v-model.number="form.valueN"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
                  required
              />
            </div>

            <div>
              <label class="block mb-1">Cell type</label>
              <select
                  v-model="form.cellType"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">-</option>
                <option value="PERC">PERC</option>
                <option value="TOPCON">TOPCON</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Zone</label>
              <select
                  v-model="form.zone"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">-</option>
                <option value="TOP">TOP</option>
                <option value="MIDDLE">MIDDLE</option>
                <option value="BOTTOM">BOTTOM</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block mb-1">Ribbon type</label>
              <input
                  v-model="form.ribbonType"
                  type="text"
                  placeholder="0.5x0.2 CuSn"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Ribbon batch</label>
              <input
                  v-model="form.ribbonBatch"
                  type="text"
                  placeholder="L123456"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Flux type</label>
              <input
                  v-model="form.fluxType"
                  type="text"
                  placeholder="Alpha X, no-clean..."
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">Notas</label>
            <textarea
                v-model="form.operatorNotes"
                rows="2"
                class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <button
                type="button"
                class="px-4 py-2 rounded border border-slate-600 text-sm"
                @click="closeForm"
            >
              Cancelar
            </button>
            <button
                type="submit"
                class="px-4 py-2 rounded bg-blue-600 text-white text-sm"
                :disabled="submitting"
            >
              {{ submitting ? 'A guardar...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="peelStore.loading" class="text-sm text-slate-400">
      A carregar medições...
    </div>
    <div v-if="peelStore.error" class="text-sm text-red-400">
      {{ peelStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePeelForceStore } from '@/stores/peelForceStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const peelStore = usePeelForceStore();
const machinesStore = useMachinesStore();

const filters = ref({
  machineId: '',
  cellType: '',
  zone: '',
  from: '',
  to: '',
});

const showForm = ref(false);
const submitting = ref(false);

const form = ref({
  machineId: '',
  valueN: null,
  ribbonType: '',
  ribbonBatch: '',
  fluxType: '',
  cellType: '',
  zone: '',
  operatorNotes: '',
  measurementDatetime: '',
});

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function load() {
  const params = {
    machineId: filters.value.machineId || undefined,
  };

  if (filters.value.from) params.from = `${filters.value.from}T00:00:00`;
  if (filters.value.to) params.to = `${filters.value.to}T23:59:59`;

  await peelStore.loadPeelForce(params);
}

const filteredList = computed(() => {
  return peelStore.list.filter((m) => {
    if (filters.value.cellType && (m.cell_type || m.cellType) !== filters.value.cellType)
      return false;
    if (filters.value.zone && m.zone !== filters.value.zone) return false;
    return true;
  });
});

function applyLocalFilter() {
  // como o backend só filtra por machineId/from/to,
  // cellType/zone filtramos aqui em cima (computed).
}

function resetForm() {
  form.value = {
    machineId: '',
    valueN: null,
    ribbonType: '',
    ribbonBatch: '',
    fluxType: '',
    cellType: '',
    zone: '',
    operatorNotes: '',
    measurementDatetime: '',
  };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function submitPeelForce() {
  try {
    submitting.value = true;

    const payload = {
      machineId: form.value.machineId,
      valueN: form.value.valueN,
      ribbonType: form.value.ribbonType || null,
      ribbonBatch: form.value.ribbonBatch || null,
      fluxType: form.value.fluxType || null,
      cellType: form.value.cellType || null,
      zone: form.value.zone || null,
      operatorNotes: form.value.operatorNotes || null,
      measurementDatetime: form.value.measurementDatetime || null,
    };

    await peelStore.addPeelForce(payload);
    closeForm();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar medição de peel force');
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  if (!machinesStore.list.length) {
    await machinesStore.loadMachines();
  }
  await load();
});
</script>
