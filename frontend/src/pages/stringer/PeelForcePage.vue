<!-- frontend/src/pages/stringer/PeelForcePage.vue -->
<template>
  <div class="space-y-4">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold">Stringer – Peel force measurements</h1>
        <p class="text-xs text-slate-400">
          Registo e análise de peel force (N) por máquina, zona e batch de ribbon.
        </p>
      </div>
    </header>

    <!-- Filtros -->
    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <h2 class="text-sm font-semibold mb-2">Filtros</h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label class="block mb-1">Máquina</label>
          <select
              v-model.number="filters.machineId"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          >
            <option :value="null">Todas</option>
            <option
                v-for="m in machines"
                :key="m.id"
                :value="m.id"
            >
              {{ m.name }} ({{ m.code }})
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Data desde</label>
          <input
              v-model="filters.from"
              type="date"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>

        <div>
          <label class="block mb-1">Data até</label>
          <input
              v-model="filters.to"
              type="date"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          />
        </div>

        <div class="flex items-end gap-2">
          <button
              class="px-3 py-2 rounded bg-sky-600 hover:bg-sky-500 text-xs disabled:opacity-50"
              :disabled="loadingList"
              @click="loadList"
          >
            <span v-if="loadingList">A carregar...</span>
            <span v-else>Aplicar filtros</span>
          </button>
          <button
              class="px-3 py-2 rounded border border-slate-600 hover:bg-slate-800 text-xs"
              @click="resetFilters"
          >
            Limpar
          </button>
        </div>
      </div>
    </section>

    <!-- Form de nova medição -->
    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <h2 class="text-sm font-semibold mb-2">Nova medição de peel force</h2>

      <form @submit.prevent="submitForm" class="space-y-3 text-xs">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block mb-1">Máquina</label>
            <select
                v-model.number="form.machineId"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                required
            >
              <option
                  v-for="m in machines"
                  :key="m.id"
                  :value="m.id"
              >
                {{ m.name }} ({{ m.code }})
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Valor (N)</label>
            <input
                v-model.number="form.valueN"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                required
            />
          </div>

          <div>
            <label class="block mb-1">Zona</label>
            <select
                v-model="form.zone"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                required
            >
              <option value="TOP">Top</option>
              <option value="CENTER">Center</option>
              <option value="BOTTOM">Bottom</option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Data/hora da medição</label>
            <input
                v-model="form.measurementDatetime"
                type="datetime-local"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block mb-1">Ribbon type</label>
            <input
                v-model="form.ribbonType"
                type="text"
                placeholder="ex: 0.5 x 0.2 mm"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">Ribbon batch</label>
            <input
                v-model="form.ribbonBatch"
                type="text"
                placeholder="ex: RB2025-01"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">Flux type</label>
            <input
                v-model="form.fluxType"
                type="text"
                placeholder="ex: NC-951"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">Cell type</label>
            <input
                v-model="form.cellType"
                type="text"
                placeholder="ex: TOPCon"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block mb-1">Notas do operador</label>
          <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
              placeholder="Observações relevantes (ex: ribbon novo, ajuste de temperatura, etc.)"
          ></textarea>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-[11px] text-slate-400">
            As medições são sempre associadas ao utilizador autenticado (operator_id).
          </p>

          <button
              type="submit"
              class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-xs disabled:opacity-50"
              :disabled="submitting"
          >
            <span v-if="submitting">A guardar...</span>
            <span v-else>Guardar medição</span>
          </button>
        </div>
      </form>
    </section>

    <!-- Lista de medições -->
    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">Medições registadas</h2>
        <span class="text-[11px] text-slate-400">
          {{ list.length }} registos
        </span>
      </div>

      <div v-if="loadingList" class="text-xs text-slate-400">
        A carregar dados...
      </div>

      <div v-else-if="list.length === 0" class="text-xs text-slate-400">
        Ainda não há medições para os filtros selecionados.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-[11px]">
          <thead class="bg-slate-950">
          <tr>
            <th class="text-left px-2 py-1">Data/hora</th>
            <th class="text-left px-2 py-1">Máquina</th>
            <th class="text-right px-2 py-1">Valor (N)</th>
            <th class="text-left px-2 py-1">Zona</th>
            <th class="text-left px-2 py-1">Ribbon batch</th>
            <th class="text-left px-2 py-1">Flux</th>
            <th class="text-left px-2 py-1">Cell</th>
            <th class="text-left px-2 py-1">Operador</th>
            <th class="text-left px-2 py-1">Notas</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
          <tr
              v-for="item in list"
              :key="item.id"
          >
            <td class="px-2 py-1">
              {{ formatDate(item.measurement_datetime) }}
            </td>
            <td class="px-2 py-1">
              {{ item.Machine?.name }} ({{ item.Machine?.code }})
            </td>
            <td class="px-2 py-1 text-right">
              {{ item.value_n.toFixed(2) }}
            </td>
            <td class="px-2 py-1">
              {{ item.zone }}
            </td>
            <td class="px-2 py-1">
              {{ item.ribbon_batch || '-' }}
            </td>
            <td class="px-2 py-1">
              {{ item.flux_type || '-' }}
            </td>
            <td class="px-2 py-1">
              {{ item.cell_type || '-' }}
            </td>
            <td class="px-2 py-1">
              {{ item.User?.name || '-' }}
            </td>
            <td class="px-2 py-1 max-w-xs truncate" :title="item.operator_notes">
              {{ item.operator_notes || '-' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../utils/apiClient.js';

const machines = ref([]);
const list = ref([]);
const loadingList = ref(false);
const submitting = ref(false);

const filters = reactive({
  machineId: null,
  from: '',
  to: '',
});

const form = reactive({
  machineId: null,
  valueN: null,
  zone: 'TOP',
  measurementDatetime: '',
  ribbonType: '',
  ribbonBatch: '',
  fluxType: '',
  cellType: '',
  notes: '',
});

function toIsoOrNull(dateString, endOfDay = false) {
  if (!dateString) return null;
  // dateString = 'YYYY-MM-DD'
  const base = endOfDay ? `${dateString}T23:59` : `${dateString}T00:00`;
  return new Date(base).toISOString();
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

function resetFilters() {
  filters.machineId = null;
  filters.from = '';
  filters.to = '';
  loadList();
}

async function loadMachines() {
  const res = await api.get('/machines');
  machines.value = res.data || [];

  if (!form.machineId && machines.value.length > 0) {
    form.machineId = machines.value[0].id;
  }
  if (!filters.machineId && machines.value.length > 0) {
    filters.machineId = machines.value[0].id;
  }
}

async function loadList() {
  loadingList.value = true;
  try {
    const params = {};
    if (filters.machineId) params.machineId = filters.machineId;
    if (filters.from) params.from = toIsoOrNull(filters.from, false);
    if (filters.to) params.to = toIsoOrNull(filters.to, true);

    const res = await api.get('/peel-force', { params });
    list.value = res.data || [];
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar medições de peel force (ver consola).');
  } finally {
    loadingList.value = false;
  }
}

async function submitForm() {
  if (!form.machineId || !form.valueN || !form.zone) {
    alert('Máquina, valor e zona são obrigatórios.');
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      machineId: form.machineId,
      valueN: form.valueN,
      zone: form.zone,
      ribbonType: form.ribbonType || null,
      ribbonBatch: form.ribbonBatch || null,
      fluxType: form.fluxType || null,
      cellType: form.cellType || null,
      notes: form.notes || null,
      measurementDatetime: form.measurementDatetime
          ? new Date(form.measurementDatetime).toISOString()
          : new Date().toISOString(),
    };

    await api.post('/peel-force', payload);

    // reset parcial
    form.valueN = null;
    form.notes = '';
    // manter machineId / zone / ribbons, etc. para entrada rápida

    await loadList();
  } catch (err) {
    console.error(err);
    alert('Erro ao guardar medição (ver consola).');
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await loadMachines();
  await loadList();
});
</script>
