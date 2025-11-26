<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Recipe Changes</h1>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="showForm = true">
        + Nova Alteração
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

      <input
          v-model="filters.parameterGroup"
          type="text"
          placeholder="Grupo (TEMPERATURE, VACUUM...)"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="load"
      />

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
          <th class="p-2 text-left">Grupo</th>
          <th class="p-2 text-left">Parâmetro</th>
          <th class="p-2 text-right">Old</th>
          <th class="p-2 text-right">New</th>
          <th class="p-2 text-left">Unit</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="r in recipeStore.list"
            :key="r.id"
            class="border-t border-slate-700 hover:bg-slate-800/60"
        >
          <td class="p-2">
            {{ formatDateTime(r.change_datetime || r.changeDatetime) }}
          </td>
          <td class="p-2">
            {{ r.Machine?.code }} - {{ r.Machine?.name }}
          </td>
          <td class="p-2">
            {{ r.parameter_group || '-' }}
          </td>
          <td class="p-2">
            {{ r.parameter_name }}
          </td>
          <td class="p-2 text-right">
            {{ r.old_value ?? '-' }}
          </td>
          <td class="p-2 text-right text-emerald-300">
            {{ r.new_value }}
          </td>
          <td class="p-2">
            {{ r.unit || '-' }}
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
          <h2 class="text-xl font-semibold">Nova Alteração de Receita</h2>
          <button class="text-slate-400 hover:text-white" @click="closeForm">✕</button>
        </div>

        <form @submit.prevent="submitRecipeChange" class="space-y-3 text-sm">
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
                  v-model="form.changeDatetime"
                  type="datetime-local"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Grupo</label>
              <input
                  v-model="form.parameterGroup"
                  type="text"
                  placeholder="TEMPERATURE, VACUUM..."
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>

            <div>
              <label class="block mb-1">Parâmetro *</label>
              <input
                  v-model="form.parameterName"
                  type="text"
                  required
                  placeholder="top_zone_1, bottom_zone_3..."
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block mb-1">Old value</label>
              <input
                  v-model="form.oldValue"
                  type="text"
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">New value *</label>
              <input
                  v-model="form.newValue"
                  type="text"
                  required
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label class="block mb-1">Unit</label>
              <input
                  v-model="form.unit"
                  type="text"
                  placeholder="°C, %, m/min..."
                  class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">Reason</label>
            <textarea
                v-model="form.reason"
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

    <div v-if="recipeStore.loading" class="text-sm text-slate-400">
      A carregar...
    </div>
    <div v-if="recipeStore.error" class="text-sm text-red-400">
      {{ recipeStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRecipeChangesStore } from '@/stores/recipeChangesStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const recipeStore = useRecipeChangesStore();
const machinesStore = useMachinesStore();

const filters = ref({
  machineId: '',
  parameterGroup: '',
  from: '',
  to: '',
});

const showForm = ref(false);
const submitting = ref(false);

const form = ref({
  machineId: '',
  changeDatetime: '',
  parameterGroup: '',
  parameterName: '',
  oldValue: '',
  newValue: '',
  unit: '',
  reason: '',
});

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function load() {
  const params = { ...filters.value };
  if (params.from) params.from = `${params.from}T00:00:00`;
  if (params.to) params.to = `${params.to}T23:59:59`;
  await recipeStore.loadRecipeChanges(params);
}

function resetForm() {
  form.value = {
    machineId: '',
    changeDatetime: '',
    parameterGroup: '',
    parameterName: '',
    oldValue: '',
    newValue: '',
    unit: '',
    reason: '',
  };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function submitRecipeChange() {
  try {
    submitting.value = true;
    const payload = {
      machineId: form.value.machineId,
      changeDatetime: form.value.changeDatetime || null,
      parameterGroup: form.value.parameterGroup || null,
      parameterName: form.value.parameterName,
      oldValue: form.value.oldValue || null,
      newValue: form.value.newValue,
      unit: form.value.unit || null,
      reason: form.value.reason || null,
    };

    await recipeStore.addRecipeChange(payload);
    closeForm();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar alteração de receita');
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
