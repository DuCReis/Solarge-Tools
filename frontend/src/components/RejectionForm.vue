<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl space-y-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold">Nova string rejeitada</h2>
        <button
            class="text-slate-400 hover:text-slate-200 text-sm"
            @click="emit('submitted')"
        >
          Fechar
        </button>
      </div>

      <form @submit.prevent="submit" class="space-y-4 text-xs">
        <!-- Linha 1: máquina / source / categoria / side -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label class="block mb-1">Máquina</label>
            <select
                v-model.number="form.machineId"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                required
            >
              <option disabled value="">Seleciona uma máquina</option>
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
              <option value="MC">MC</option>
              <option value="UPS">UPS</option>
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

        <!-- Linha 2: snapshot / good string / coords numéricos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block mb-1">Snapshot ID (opcional)</label>
            <input
                v-model.number="form.snapshotId"
                type="number"
                min="1"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                placeholder="ex: 12"
            />
          </div>

          <div>
            <label class="block mb-1">String boa rejeitada?</label>
            <select
                v-model="form.isGoodString"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
            >
              <option :value="false">Não</option>
              <option :value="true">Sim</option>
            </select>
          </div>

          <div>
            <label class="block mb-1">MC coords (x,y)</label>
            <div class="flex gap-1">
              <input
                  v-model.number="form.mcX"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-1/2 px-2 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                  :disabled="form.category !== 'MC'"
                  placeholder="x"
              />
              <input
                  v-model.number="form.mcY"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-1/2 px-2 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                  :disabled="form.category !== 'MC'"
                  placeholder="y"
              />
            </div>
            <p class="text-[10px] text-slate-500 mt-1">
              Também podes clicar no mapa da célula para preencher estes valores.
            </p>
          </div>
        </div>

        <!-- Mapa da célula para MC -->
        <div
            v-if="form.category === 'MC'"
            class="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-4 items-start"
        >
          <div>
            <label class="block mb-1">Mapa da célula (click para marcar MC)</label>
            <div
                ref="cellBox"
                class="relative w-52 h-52 bg-slate-950 border border-slate-700 rounded-sm cursor-crosshair select-none"
                @click="handleCellClick"
            >
              <!-- grelha suave -->
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
                  class="absolute w-3 h-3 rounded-full bg-red-500 shadow -translate-x-1.5 -translate-y-1.5"
                  :style="{
                  left: `${form.mcX * 100}%`,
                  /* y = 0 em baixo, 1 em cima → invertido na tela */
                  top: `${(1 - form.mcY) * 100}%`,
                }"
              ></div>
            </div>

            <p class="text-[11px] text-slate-400 mt-1">
              X: {{ form.mcX ?? '-' }} · Y: {{ form.mcY ?? '-' }} (0–1)
            </p>
          </div>

          <div>
            <label class="block mb-1">Notas</label>
            <textarea
                v-model="form.notes"
                rows="3"
                class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
                placeholder="Ex: MC perto do canto superior esquerdo, após troca de ribbon."
            ></textarea>
          </div>
        </div>

        <!-- Notas (quando não é MC) -->
        <div v-else>
          <label class="block mb-1">Notas</label>
          <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-sm"
              placeholder="Ex: UPS repetitivo após troca de ribbon; RM na entrada da máquina."
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
              type="button"
              class="px-3 py-2 rounded border border-slate-600 text-xs hover:bg-slate-800"
              @click="emit('submitted')"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-xs disabled:opacity-50"
              :disabled="submitting"
          >
            <span v-if="submitting">A guardar...</span>
            <span v-else>Guardar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { useRejectionsStore } from '@/stores/stringRejectionsStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const emit = defineEmits(['submitted']);

const rejectionsStore = useRejectionsStore();
const machinesStore = useMachinesStore();

const submitting = ref(false);
const cellBox = ref(null);

const form = reactive({
  machineId: '',
  source: 'MACHINE',
  category: 'MC',
  side: '',
  snapshotId: null,
  isGoodString: false,
  mcX: null,
  mcY: null,
  notes: '',
});

const machines = computed(() => machinesStore.list || []);

onMounted(async () => {
  if (!machinesStore.list.length) {
    await machinesStore.loadMachines();
  }
  if (!form.machineId && machinesStore.list.length) {
    form.machineId = machinesStore.list[0].id;
  }
});

function handleCellClick(event) {
  if (!cellBox.value) return;

  const rect = cellBox.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;   // 0 → esquerda, 1 → direita
  const yFromTop = (event.clientY - rect.top) / rect.height; // 0 → topo, 1 → baixo

  // Vamos guardar como: x: 0–1 esquerda→direita, y: 0–1 de baixo→cima (mais natural para gráficos)
  form.mcX = Number(x.toFixed(2));
  form.mcY = Number((1 - yFromTop).toFixed(2));
}

async function submit() {
  if (!form.machineId || !form.source || !form.category) {
    alert('Máquina, source e categoria são obrigatórios.');
    return;
  }

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

  submitting.value = true;
  try {
    await rejectionsStore.addRejection(payload);

    // reset básico (mas mantém máquina, source e categoria para entrada rápida)
    form.snapshotId = null;
    form.isGoodString = false;
    form.mcX = null;
    form.mcY = null;
    form.notes = '';

    emit('submitted'); // fecha modal + refresh na view
  } catch (err) {
    console.error(err);
    alert('Erro ao guardar rejeição (ver consola/backend).');
  } finally {
    submitting.value = false;
  }
}
</script>
