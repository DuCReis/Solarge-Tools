<template>
  <div class="space-y-4">
    <header>
      <h1 class="text-lg font-semibold">Stringer – Machine snapshots</h1>
      <p class="text-xs text-slate-400">
        Registo manual de counters e tempos a partir do HMI da máquina.
      </p>
    </header>

    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs mb-1">Machine ID</label>
          <input
              v-model.number="machineId"
              type="number"
              min="1"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs mb-1">Snapshot datetime</label>
          <input
              v-model="snapshotDatetime"
              type="datetime-local"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs mb-1">Shift</label>
          <input
              v-model="shift"
              type="text"
              placeholder="A / B / C"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block text-xs mb-1">Produced strings (partial)</label>
          <input
              v-model.number="producedStringsPartial"
              type="number"
              min="0"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs mb-1">Rejected strings (partial)</label>
          <input
              v-model.number="rejectedStringsPartial"
              type="number"
              min="0"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>
      </div>

      <div class="flex items-center justify-between mt-2">
        <button
            class="px-4 py-2 text-xs rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
            :disabled="submitting"
            @click="submitSnapshot"
        >
          <span v-if="submitting">A guardar...</span>
          <span v-else>Guardar snapshot (teste)</span>
        </button>

        <span class="text-[11px] text-slate-400" v-if="lastSavedAt">
          Último registo: {{ lastSavedAt }}
        </span>
      </div>
    </section>

    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <h2 class="text-sm font-semibold">Histórico (teste)</h2>

      <button
          class="px-3 py-1 text-xs rounded border border-slate-700 hover:bg-slate-800"
          @click="loadHistory"
      >
        Carregar histórico
      </button>

      <div v-if="loadingHistory" class="text-xs text-slate-400 mt-2">
        A carregar...
      </div>

      <table v-else class="min-w-full text-[11px] mt-2">
        <thead class="bg-slate-950">
        <tr>
          <th class="text-left px-2 py-1">Datetime</th>
          <th class="text-left px-2 py-1">Operator</th>
          <th class="text-right px-2 py-1">Prod. strings (partial)</th>
          <th class="text-right px-2 py-1">Rej. strings (partial)</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
        <tr v-for="row in history" :key="row.id">
          <td class="px-2 py-1">
            {{ formatDate(row.snapshot_datetime) }}
          </td>
          <td class="px-2 py-1">
            {{ row.User?.name || 'N/A' }}
          </td>
          <td class="px-2 py-1 text-right">
            {{ row.produced_strings_partial }}
          </td>
          <td class="px-2 py-1 text-right">
            {{ row.rejected_strings_partial }}
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../utils/apiClient.js';

const machineId = ref(1);
const snapshotDatetime = ref(new Date().toISOString().slice(0, 16));
const shift = ref('');

const producedStringsPartial = ref(0);
const rejectedStringsPartial = ref(0);

const submitting = ref(false);
const lastSavedAt = ref('');

const history = ref([]);
const loadingHistory = ref(false);

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

async function submitSnapshot() {
  submitting.value = true;
  try {
    const payload = {
      snapshotDatetime: new Date(snapshotDatetime.value).toISOString(),

      producedStringsPartial: producedStringsPartial.value,
      producedStringsTotal: producedStringsPartial.value, // só para não ser null
      rejectedStringsPartial: rejectedStringsPartial.value,
      rejectedStringsTotal: rejectedStringsPartial.value,

      // resto dos campos fica a 0 / null neste teste
      placedRibbonsPartial: 0,
      placedRibbonsTotal: 0,
      producedCellsPartial: 0,
      producedCellsTotal: 0,
      rejectedCellsPartial: 0,
      rejectedCellsTotal: 0,
      solderedCellsPartial: 0,
      solderedCellsTotal: 0,

      waitingTimeSec: 0,
      alarmTimeSec: 0,
      stopTimeSec: 0,
      workingTimeSec: 0,

      shift: shift.value || null,
      notes: null,
    };

    await api.post(`/machines/${machineId.value}/production-snapshots`, payload);
    lastSavedAt.value = new Date().toLocaleString();
    await loadHistory();
  } catch (err) {
    console.error(err);
    alert('Erro ao guardar snapshot (ver consola).');
  } finally {
    submitting.value = false;
  }
}

async function loadHistory() {
  loadingHistory.value = true;
  try {
    const res = await api.get(`/machines/${machineId.value}/production-snapshots`);
    history.value = res.data;
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar histórico (ver consola).');
  } finally {
    loadingHistory.value = false;
  }
}

// carregar logo no início
loadHistory();
</script>
