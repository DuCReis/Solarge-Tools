<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Maintenance Logs</h1>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="showForm = true">
        + Nova Manutenção
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
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      <select
          v-model="filters.severity"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      >
        <option value="">Severity</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="CRITICAL">CRITICAL</option>
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
          <th class="p-2 text-left">Início</th>
          <th class="p-2 text-left">Máquina</th>
          <th class="p-2 text-left">Tipo</th>
          <th class="p-2 text-left">Categoria</th>
          <th class="p-2 text-left">Severity</th>
          <th class="p-2 text-left">Status</th>
          <th class="p-2 text-right">Duração (min)</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="m in maintenanceStore.list"
            :key="m.id"
            class="border-t border-slate-700 hover:bg-slate-800/60"
        >
          <td class="p-2">
            {{ formatDateTime(m.start_datetime || m.startDatetime) }}
          </td>
          <td class="p-2">
            {{ m.Machine?.code }} - {{ m.Machine?.name }}
          </td>
          <td class="p-2">
            {{ m.type || '-' }}
          </td>
          <td class="p-2">
            {{ m.category || '-' }}
          </td>
          <td class="p-2">
              <span :class="severityClass(m.severity)">
                {{ m.severity || '-' }}
              </span>
          </td>
          <td class="p-2">
              <span :class="statusClass(m.status)">
                {{ m.status }}
              </span>
          </td>
          <td class="p-2 text-right">
            {{ m.duration_minutes ?? '-' }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: nova manutenção -->
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 rounded-lg shadow-xl w-full max-w-xl p-6 space-y-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold">Nova Manutenção</h2>
          <button class="text-slate-400 hover:text-white" @click="closeForm">✕</button>
        </div>

        <form @submit.prevent="submitMaintenance" class="space-y-3 text-sm">
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
              <label class="block mb-1">Tipo</label>
              <select
                  v-model="form.type"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">-</option>
                <option value="PLANNED">PLANNED</option>
                <option value="UNPLANNED">UNPLANNED</option>
                <option value="BREAKDOWN">BREAKDOWN</option>
                <option value="INSPECTION">INSPECTION</option>
                <option value="CLEANING">CLEANING</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Severity</label>
              <select
                  v-model="form.severity"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">-</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Status</label>
              <select
                  v-model="form.status"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Início</label>
              <input
                  v-model="form.startDatetime"
                  type="datetime-local"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Fim (opcional)</label>
              <input
                  v-model="form.endDatetime"
                  type="datetime-local"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">Descrição</label>
            <textarea
                v-model="form.description"
                rows="3"
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

    <div v-if="maintenanceStore.loading" class="text-sm text-slate-400">
      A carregar...
    </div>
    <div v-if="maintenanceStore.error" class="text-sm text-red-400">
      {{ maintenanceStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMaintenanceStore } from '@/stores/maintenanceStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const maintenanceStore = useMaintenanceStore();
const machinesStore = useMachinesStore();

const filters = ref({
  machineId: '',
  status: '',
  severity: '',
  from: '',
  to: '',
});

const showForm = ref(false);
const submitting = ref(false);

const form = ref({
  machineId: '',
  type: '',
  category: '',
  severity: '',
  status: 'OPEN',
  startDatetime: '',
  endDatetime: '',
  description: '',
});

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function severityClass(sev) {
  switch (sev) {
    case 'HIGH':
    case 'CRITICAL':
      return 'inline-flex px-2 py-0.5 rounded bg-red-700/60 text-red-100 text-xs';
    case 'MEDIUM':
      return 'inline-flex px-2 py-0.5 rounded bg-yellow-700/60 text-yellow-100 text-xs';
    case 'LOW':
      return 'inline-flex px-2 py-0.5 rounded bg-emerald-700/60 text-emerald-100 text-xs';
    default:
      return 'inline-flex px-2 py-0.5 rounded bg-slate-700/60 text-slate-100 text-xs';
  }
}

function statusClass(st) {
  switch (st) {
    case 'OPEN':
      return 'inline-flex px-2 py-0.5 rounded bg-red-800/70 text-red-100 text-xs';
    case 'IN_PROGRESS':
      return 'inline-flex px-2 py-0.5 rounded bg-yellow-800/70 text-yellow-100 text-xs';
    case 'DONE':
      return 'inline-flex px-2 py-0.5 rounded bg-emerald-800/70 text-emerald-100 text-xs';
    default:
      return 'inline-flex px-2 py-0.5 rounded bg-slate-700/60 text-slate-100 text-xs';
  }
}

async function load() {
  const params = { ...filters.value };
  if (params.from) params.from = `${params.from}T00:00:00`;
  if (params.to) params.to = `${params.to}T23:59:59`;
  await maintenanceStore.loadMaintenance(params);
}

function resetForm() {
  form.value = {
    machineId: '',
    type: '',
    category: '',
    severity: '',
    status: 'OPEN',
    startDatetime: '',
    endDatetime: '',
    description: '',
  };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function submitMaintenance() {
  try {
    submitting.value = true;

    const payload = {
      machineId: form.value.machineId,
      type: form.value.type || null,
      category: form.value.category || null,
      severity: form.value.severity || null,
      status: form.value.status || 'OPEN',
      startDatetime: form.value.startDatetime || null,
      endDatetime: form.value.endDatetime || null,
      description: form.value.description || null,
    };

    await maintenanceStore.addMaintenance(payload);
    closeForm();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar manutenção');
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
