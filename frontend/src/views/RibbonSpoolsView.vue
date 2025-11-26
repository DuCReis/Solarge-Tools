<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Ribbon Spools</h1>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="showForm = true">
        + Novo Spool
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
          v-model="filters.status"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      >
        <option value="">Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="FINISHED">FINISHED</option>
        <option value="PLANNED">PLANNED</option>
      </select>

      <select
          v-model="filters.side"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      >
        <option value="">Side</option>
        <option value="LEFT">LEFT</option>
        <option value="RIGHT">RIGHT</option>
        <option value="BOTH">BOTH</option>
      </select>

      <input
          v-model="filters.batchCode"
          type="text"
          placeholder="Batch code"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      />

      <input
          v-model="filters.from"
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
          <th class="p-2 text-left">Início</th>
          <th class="p-2 text-left">Máquina</th>
          <th class="p-2 text-left">Batch</th>
          <th class="p-2 text-left">Side</th>
          <th class="p-2 text-right">Start (g)</th>
          <th class="p-2 text-right">Current (g)</th>
          <th class="p-2 text-right">End (g)</th>
          <th class="p-2 text-left">Status</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="s in ribbonStore.list"
            :key="s.id"
            class="border-t border-slate-700 hover:bg-slate-800/60"
        >
          <td class="p-2">
            {{ formatDateTime(s.start_datetime || s.startDatetime) }}
          </td>
          <td class="p-2">
            {{ s.Machine?.code }} - {{ s.Machine?.name }}
          </td>
          <td class="p-2">
            {{ s.batch_code }}
          </td>
          <td class="p-2">
            {{ s.side || '-' }}
          </td>
          <td class="p-2 text-right">
            {{ s.weight_start_g ?? '-' }}
          </td>
          <td class="p-2 text-right">
            {{ s.weight_current_g ?? '-' }}
          </td>
          <td class="p-2 text-right">
            {{ s.weight_end_g ?? '-' }}
          </td>
          <td class="p-2">
              <span :class="statusClass(s.status)">
                {{ s.status }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 rounded-lg shadow-xl w-full max-w-xl p-6 space-y-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold">Novo Ribbon Spool</h2>
          <button class="text-slate-400 hover:text-white" @click="closeForm">✕</button>
        </div>

        <form @submit.prevent="submitRibbon" class="space-y-3 text-sm">
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
              <label class="block mb-1">Side</label>
              <select
                  v-model="form.side"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">-</option>
                <option value="LEFT">LEFT</option>
                <option value="RIGHT">RIGHT</option>
                <option value="BOTH">BOTH</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Batch code *</label>
              <input
                  v-model="form.batchCode"
                  type="text"
                  required
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Supplier</label>
              <input
                  v-model="form.supplier"
                  type="text"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Material</label>
              <input
                  v-model="form.material"
                  type="text"
                  placeholder="Cu-Sn60..."
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Start weight (g)</label>
              <input
                  v-model.number="form.weightStartG"
                  type="number"
                  min="0"
                  step="0.001"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block mb-1">Width (mm)</label>
              <input
                  v-model.number="form.widthMm"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Thickness (mm)</label>
              <input
                  v-model.number="form.thicknessMm"
                  type="number"
                  min="0"
                  step="0.001"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Est. cons./string</label>
              <input
                  v-model.number="form.estimatedConsumptionPerString"
                  type="number"
                  min="0"
                  step="0.0001"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">Start datetime</label>
            <input
                v-model="form.startDatetime"
                type="datetime-local"
                class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
            />
          </div>

          <div>
            <label class="block mb-1">Notas</label>
            <textarea
                v-model="form.notes"
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

    <div v-if="ribbonStore.loading" class="text-sm text-slate-400">
      A carregar...
    </div>
    <div v-if="ribbonStore.error" class="text-sm text-red-400">
      {{ ribbonStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRibbonSpoolsStore } from '@/stores/ribbonSpoolsStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const ribbonStore = useRibbonSpoolsStore();
const machinesStore = useMachinesStore();

const filters = ref({
  machineId: '',
  status: '',
  side: '',
  batchCode: '',
  from: '',
});

const showForm = ref(false);
const submitting = ref(false);

const form = ref({
  machineId: '',
  side: '',
  batchCode: '',
  supplier: '',
  material: '',
  widthMm: null,
  thicknessMm: null,
  weightStartG: null,
  estimatedConsumptionPerString: null,
  startDatetime: '',
  notes: '',
});

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function statusClass(st) {
  switch (st) {
    case 'ACTIVE':
      return 'inline-flex px-2 py-0.5 rounded bg-emerald-800/70 text-emerald-100 text-xs';
    case 'FINISHED':
      return 'inline-flex px-2 py-0.5 rounded bg-slate-700/70 text-slate-100 text-xs';
    case 'PLANNED':
      return 'inline-flex px-2 py-0.5 rounded bg-blue-800/70 text-blue-100 text-xs';
    default:
      return 'inline-flex px-2 py-0.5 rounded bg-slate-700/60 text-slate-100 text-xs';
  }
}

async function load() {
  const params = { ...filters.value };
  if (params.from) params.from = `${params.from}T00:00:00`;
  await ribbonStore.loadRibbonSpools(params);
}

function resetForm() {
  form.value = {
    machineId: '',
    side: '',
    batchCode: '',
    supplier: '',
    material: '',
    widthMm: null,
    thicknessMm: null,
    weightStartG: null,
    estimatedConsumptionPerString: null,
    startDatetime: '',
    notes: '',
  };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function submitRibbon() {
  try {
    submitting.value = true;
    const payload = {
      machineId: form.value.machineId,
      side: form.value.side || null,
      batchCode: form.value.batchCode,
      supplier: form.value.supplier || null,
      material: form.value.material || null,
      widthMm: form.value.widthMm,
      thicknessMm: form.value.thicknessMm,
      weightStartG: form.value.weightStartG,
      estimatedConsumptionPerString: form.value.estimatedConsumptionPerString,
      startDatetime: form.value.startDatetime || null,
      notes: form.value.notes || null,
    };

    await ribbonStore.addRibbonSpool(payload);
    closeForm();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar ribbon spool');
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
