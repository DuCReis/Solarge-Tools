<template>
  <div class="space-y-4">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold">Stringer – String rejections & MC</h1>
        <p class="text-xs text-slate-400">
          Registo estruturado de UPS / MC / RM / BC / Other e strings boas rejeitadas.
        </p>
      </div>
    </header>

    <!-- Filtros -->
    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <h2 class="text-sm font-semibold mb-2">Filtros</h2>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
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
          <label class="block mb-1">Source</label>
          <select
              v-model="filters.source"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          >
            <option value="">Todos</option>
            <option value="MACHINE">Machine</option>
            <option value="OPERATOR">Operator</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Categoria</label>
          <select
              v-model="filters.category"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
          >
            <option value="">Todas</option>
            <option value="UPS">UPS</option>
            <option value="MC">MC</option>
            <option value="RM">RM</option>
            <option value="BC">BC</option>
            <option value="OTHER">Other</option>
            <option value="GOOD_REJECTED">Good string rejected</option>
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
      </div>

      <div class="flex items-center gap-3 mt-2 text-xs">
        <label class="inline-flex items-center gap-1">
          <input
              v-model="filters.onlyGoodStrings"
              type="checkbox"
              class="accent-sky-500"
          />
          <span>Mostrar apenas strings boas rejeitadas</span>
        </label>

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
    </section>

    <!-- Form de nova rejeição -->
    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <h2 class="text-sm font-semibold mb-2">Novo registo de string rejeitada</h2>

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
            <label class="block mb-1">Source</label>
            <select
                v-model="form.source"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                required
            >
              <option value="MACHINE">Machine</option>
              <option value="OPERATOR">Operator</option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Categoria</label>
            <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                required
            >
              <option value="UPS">UPS</option>
              <option value="MC">MC</option>
              <option value="RM">RM</option>
              <option value="BC">BC</option>
              <option value="OTHER">Other</option>
              <option value="GOOD_REJECTED">Good string rejected</option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Side</label>
            <select
                v-model="form.side"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            >
              <option value="">-</option>
              <option value="LEFT">Left</option>
              <option value="CENTER">Center</option>
              <option value="RIGHT">Right</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block mb-1">Snapshot ID (opcional)</label>
            <input
                v-model.number="form.snapshotId"
                type="number"
                min="1"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                placeholder="ex: 123 (ligar a production snapshot)"
            />
          </div>

          <div>
            <label class="block mb-1">String boa mas rejeitada?</label>
            <select
                v-model="form.isGoodString"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            >
              <option :value="false">Não</option>
              <option :value="true">Sim</option>
            </select>
          </div>

          <div>
            <label class="block mb-1">MC X (0-1)</label>
            <input
                v-model.number="form.mcX"
                type="number"
                min="0"
                max="1"
                step="0.01"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                :disabled="form.category !== 'MC'"
            />
          </div>

          <div>
            <label class="block mb-1">MC Y (0-1)</label>
            <input
                v-model.number="form.mcY"
                type="number"
                min="0"
                max="1"
                step="0.01"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                :disabled="form.category !== 'MC'"
            />
          </div>
        </div>

        <!-- Mini mapa da célula para MC -->
        <div
            v-if="form.category === 'MC'"
            class="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-4 items-start"
        >
          <div>
            <p class="text-[11px] text-slate-400 mb-1">
              Clica no mapa para registar a posição da MC na célula (0–1).
            </p>
            <div
                ref="cellCanvas"
                class="relative w-48 h-48 bg-slate-950 border border-slate-700 rounded-sm cursor-crosshair"
                @click="handleCellClick"
            >
              <!-- grelha leve -->
              <div
                  v-for="i in 3"
                  :key="'v'+i"
                  class="absolute top-0 bottom-0 border-l border-slate-800/60"
                  :style="{ left: `${(i / 4) * 100}%` }"
              ></div>
              <div
                  v-for="j in 3"
                  :key="'h'+j"
                  class="absolute left-0 right-0 border-t border-slate-800/60"
                  :style="{ top: `${(j / 4) * 100}%` }"
              ></div>

              <!-- ponto da MC -->
              <div
                  v-if="form.mcX !== null && form.mcY !== null"
                  class="absolute w-3 h-3 rounded-full bg-red-500 -translate-x-1.5 -translate-y-1.5 shadow"
                  :style="{
                  left: `${form.mcX * 100}%`,
                  top: `${(1 - form.mcY) * 100}%`,
                }"
              ></div>
            </div>

            <p class="text-[11px] text-slate-400 mt-1">
              X: {{ form.mcX ?? '-' }} · Y: {{ form.mcY ?? '-' }}
            </p>
          </div>

          <div>
            <label class="block mb-1">Notas</label>
            <textarea
                v-model="form.notes"
                rows="3"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                placeholder="Ex: MC na zona do busbar 3, perto do canto esquerdo superior."
            ></textarea>
          </div>
        </div>

        <div v-else>
          <label class="block mb-1">Notas</label>
          <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
              placeholder="Ex: UPS repetitivo após troca de ribbon; RM na entrada da máquina."
          ></textarea>
        </div>

        <div class="flex items-center justify-between mt-2">
          <p class="text-[11px] text-slate-400">
            O operador autenticado é registado automaticamente (operator_id).
          </p>

          <button
              type="submit"
              class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-xs disabled:opacity-50"
              :disabled="submitting"
          >
            <span v-if="submitting">A guardar...</span>
            <span v-else>Guardar rejeição</span>
          </button>
        </div>
      </form>
    </section>

    <!-- Lista de rejeições -->
    <section class="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">Rejeições registadas</h2>
        <span class="text-[11px] text-slate-400">
          {{ list.length }} registos
        </span>
      </div>

      <div v-if="loadingList" class="text-xs text-slate-400">
        A carregar dados...
      </div>

      <div v-else-if="list.length === 0" class="text-xs text-slate-400">
        Ainda não há registos para os filtros selecionados.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-[11px]">
          <thead class="bg-slate-950">
          <tr>
            <th class="text-left px-2 py-1">Data</th>
            <th class="text-left px-2 py-1">Máquina</th>
            <th class="text-left px-2 py-1">Source</th>
            <th class="text-left px-2 py-1">Categoria</th>
            <th class="text-left px-2 py-1">Side</th>
            <th class="text-left px-2 py-1">Good?</th>
            <th class="text-left px-2 py-1">MC (x,y)</th>
            <th class="text-left px-2 py-1">Operador</th>
            <th class="text-left px-2 py-1">Snapshot</th>
            <th class="text-left px-2 py-1">Notas</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
          <tr v-for="item in list" :key="item.id">
            <td class="px-2 py-1">
              {{ formatDate(item.created_at || item.createdAt) }}
            </td>
            <td class="px-2 py-1">
              {{ item.Machine?.name }} ({{ item.Machine?.code }})
            </td>
            <td class="px-2 py-1">
              {{ item.source }}
            </td>
            <td class="px-2 py-1">
              {{ item.category }}
            </td>
            <td class="px-2 py-1">
              {{ item.side || '-' }}
            </td>
            <td class="px-2 py-1">
              {{ item.is_good_string ? 'Yes' : 'No' }}
            </td>
            <td class="px-2 py-1">
                <span v-if="item.mc_x !== null && item.mc_y !== null">
                  ({{ item.mc_x.toFixed(2) }}, {{ item.mc_y.toFixed(2) }})
                </span>
              <span v-else>-</span>
            </td>
            <td class="px-2 py-1">
              {{ item.User?.name || '-' }}
            </td>
            <td class="px-2 py-1">
                <span v-if="item.MachineProductionSnapshot">
                  #{{ item.MachineProductionSnapshot.id }}
                </span>
              <span v-else>-</span>
            </td>
            <td class="px-2 py-1 max-w-xs truncate" :title="item.notes">
              {{ item.notes || '-' }}
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
const cellCanvas = ref(null);

const filters = reactive({
  machineId: null,
  source: '',
  category: '',
  from: '',
  to: '',
  onlyGoodStrings: false,
});

const form = reactive({
  machineId: null,
  source: 'MACHINE',
  category: 'MC',
  side: '',
  snapshotId: null,
  isGoodString: false,
  mcX: null,
  mcY: null,
  notes: '',
});

function toIsoOrNull(dateString, endOfDay = false) {
  if (!dateString) return null;
  const base = endOfDay ? `${dateString}T23:59` : `${dateString}T00:00`;
  return new Date(base).toISOString();
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

function resetFilters() {
  filters.machineId = machines.value[0]?.id || null;
  filters.source = '';
  filters.category = '';
  filters.from = '';
  filters.to = '';
  filters.onlyGoodStrings = false;
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
    if (filters.source) params.source = filters.source;
    if (filters.category) params.category = filters.category;
    if (filters.from) params.from = toIsoOrNull(filters.from, false);
    if (filters.to) params.to = toIsoOrNull(filters.to, true);
    if (filters.onlyGoodStrings) params.isGoodString = 'true';

    const res = await api.get('/string-rejections', { params });
    list.value = res.data || [];
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar string rejections (ver consola).');
  } finally {
    loadingList.value = false;
  }
}

async function submitForm() {
  if (!form.machineId || !form.source || !form.category) {
    alert('Máquina, source e categoria são obrigatórios.');
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      machineId: form.machineId,
      source: form.source,
      category: form.category,
      side: form.side || null,
      snapshotId: form.snapshotId || null,
      isGoodString: !!form.isGoodString,
      mcX: form.category === 'MC' ? form.mcX : null,
      mcY: form.category === 'MC' ? form.mcY : null,
      notes: form.notes || null,
    };

    await api.post('/string-rejections', payload);

    // reset ligeiro
    form.snapshotId = null;
    form.isGoodString = false;
    if (form.category === 'MC') {
      form.mcX = null;
      form.mcY = null;
    }
    form.notes = '';

    await loadList();
  } catch (err) {
    console.error(err);
    alert('Erro ao guardar string rejection (ver consola).');
  } finally {
    submitting.value = false;
  }
}

function handleCellClick(event) {
  if (form.category !== 'MC') return;

  const rect = cellCanvas.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;   // 0-1
  const y = (event.clientY - rect.top) / rect.height;   // 0-1 (top -> bottom)

  form.mcX = Number(x.toFixed(2));
  form.mcY = Number((1 - y).toFixed(2)); // invertido para bater com o desenho (0 = bottom)
}

onMounted(async () => {
  await loadMachines();
  await loadList();
});
</script>
