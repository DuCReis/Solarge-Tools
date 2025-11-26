<!-- frontend/src/views/SnapshotsView.vue -->
<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Machine Snapshots</h1>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="showForm = true">
        + Novo Snapshot
      </button>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-800/40 p-4 rounded-lg">
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
          v-model="filters.shift"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      >
        <option value="">Shift</option>
        <option value="A">Shift A</option>
        <option value="B">Shift B</option>
        <option value="C">Shift C</option>
        <option value="NIGHT">Night</option>
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
          <th class="p-2 text-right">Total</th>
          <th class="p-2 text-right text-green-400">Good</th>
          <th class="p-2 text-right text-red-400">MC</th>
          <th class="p-2 text-right text-red-400">UPS</th>
          <th class="p-2 text-right text-red-400">RM</th>
          <th class="p-2 text-right text-red-400">BC</th>
          <th class="p-2 text-right text-red-400">Other</th>
          <th class="p-2 text-right text-yellow-300">Good Rej.</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="s in snapshotsStore.list"
            :key="s.id"
            class="border-t border-slate-700 hover:bg-slate-800/60"
        >
          <td class="p-2">
            {{ formatDateTime(s.snapshot_datetime || s.snapshotDatetime) }}
          </td>
          <td class="p-2">
            {{ s.Machine?.code }} - {{ s.Machine?.name }}
          </td>
          <td class="p-2 text-right">
            {{ s.total_strings }}
          </td>
          <td class="p-2 text-right text-green-300">
            {{ s.good_strings }}
          </td>
          <td class="p-2 text-right text-red-300">
            {{ s.rejected_mc }}
          </td>
          <td class="p-2 text-right text-red-300">
            {{ s.rejected_ups }}
          </td>
          <td class="p-2 text-right text-red-300">
            {{ s.rejected_rm }}
          </td>
          <td class="p-2 text-right text-red-300">
            {{ s.rejected_bc }}
          </td>
          <td class="p-2 text-right text-red-300">
            {{ s.rejected_other }}
          </td>
          <td class="p-2 text-right text-yellow-200">
            {{ s.good_rejected }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Form modal simples -->
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 rounded-lg shadow-xl w-full max-w-xl p-6 space-y-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold">Novo Snapshot</h2>
          <button class="text-slate-400 hover:text-white" @click="closeForm">✕</button>
        </div>

        <form @submit.prevent="submitSnapshot" class="space-y-3 text-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block mb-1">Máquina *</label>
              <select
                  v-model="form.machineId"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
                  required
              >
                <option value="">Selecionar</option>
                <option v-for="m in machinesStore.list" :key="m.id" :value="m.id">
                  {{ m.code }} - {{ m.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Shift</label>
              <select
                  v-model="form.shift"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              >
                <option value="">-</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="NIGHT">Night</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">Datetime</label>
              <input
                  v-model="form.snapshotDatetime"
                  type="datetime-local"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <!-- Contagens -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label class="block mb-1">Total strings</label>
              <input
                  v-model.number="form.totalStrings"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Good</label>
              <input
                  v-model.number="form.goodStrings"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">MC</label>
              <input
                  v-model.number="form.rejectedMc"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">UPS</label>
              <input
                  v-model.number="form.rejectedUps"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">RM</label>
              <input
                  v-model.number="form.rejectedRm"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">BC</label>
              <input
                  v-model.number="form.rejectedBc"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Other</label>
              <input
                  v-model.number="form.rejectedOther"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Good rejected</label>
              <input
                  v-model.number="form.goodRejected"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">Comentários</label>
            <textarea
                v-model="form.comments"
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

    <div v-if="snapshotsStore.loading" class="text-sm text-slate-400">
      A carregar snapshots...
    </div>
    <div v-if="snapshotsStore.error" class="text-sm text-red-400">
      {{ snapshotsStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSnapshotsStore } from '@/stores/snapshotsStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const snapshotsStore = useSnapshotsStore();
const machinesStore = useMachinesStore();

const showForm = ref(false);
const submitting = ref(false);

const filters = ref({
  machineId: '',
  shift: '',
  from: '',
  to: '',
});

const form = ref({
  machineId: '',
  shift: '',
  snapshotDatetime: '',
  totalStrings: null,
  goodStrings: null,
  rejectedMc: null,
  rejectedUps: null,
  rejectedRm: null,
  rejectedBc: null,
  rejectedOther: null,
  goodRejected: null,
  comments: '',
});

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function load() {
  const params = { ...filters.value };
  // converter dates em ISO
  if (params.from) params.from = `${params.from}T00:00:00`;
  if (params.to) params.to = `${params.to}T23:59:59`;
  await snapshotsStore.loadSnapshots(params);
}

function resetForm() {
  form.value = {
    machineId: '',
    shift: '',
    snapshotDatetime: '',
    totalStrings: null,
    goodStrings: null,
    rejectedMc: null,
    rejectedUps: null,
    rejectedRm: null,
    rejectedBc: null,
    rejectedOther: null,
    goodRejected: null,
    comments: '',
  };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function submitSnapshot() {
  try {
    submitting.value = true;

    const payload = {
      machineId: form.value.machineId,
      shift: form.value.shift || null,
      snapshotDatetime: form.value.snapshotDatetime || null,
      totalStrings: form.value.totalStrings,
      goodStrings: form.value.goodStrings,
      rejectedMc: form.value.rejectedMc,
      rejectedUps: form.value.rejectedUps,
      rejectedRm: form.value.rejectedRm,
      rejectedBc: form.value.rejectedBc,
      rejectedOther: form.value.rejectedOther,
      goodRejected: form.value.goodRejected,
      comments: form.value.comments || null,
    };

    await snapshotsStore.addSnapshot(payload);
    closeForm();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar snapshot');
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
