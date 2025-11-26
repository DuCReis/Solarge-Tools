<!-- frontend/src/views/LayupEventsView.vue -->
<template>
  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Layup Events</h1>
      <button
          class="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-500"
          @click="showForm = true"
      >
        + Novo Evento
      </button>
    </div>

    <!-- Filters -->
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
          v-model="filters.eventType"
          class="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          @change="applyLocalFilter"
      >
        <option value="">Tipo</option>
        <option value="MISSING_MESH">Missing Mesh</option>
        <option value="SKEW">Skew</option>
        <option value="WRONG_CELL">Wrong Cell</option>
        <option value="DAMAGED_CELL">Damaged Cell</option>
        <option value="OTHER">Other</option>
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

    <!-- Table -->
    <div class="overflow-x-auto border border-slate-700 rounded-lg">
      <table class="w-full text-sm">
        <thead class="bg-slate-900/80">
        <tr>
          <th class="p-2 text-left">Datetime</th>
          <th class="p-2 text-left">Máquina</th>
          <th class="p-2 text-left">Evento</th>
          <th class="p-2 text-left">Notas</th>
          <th class="p-2 text-left">Operador</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="e in filteredList"
            :key="e.id"
            class="border-t border-slate-700 hover:bg-slate-800/60"
        >
          <td class="p-2">{{ formatDate(e.event_datetime || e.eventDatetime) }}</td>
          <td class="p-2">{{ e.Machine?.code }} - {{ e.Machine?.name }}</td>
          <td class="p-2">{{ e.event_type || e.eventType }}</td>
          <td class="p-2">{{ e.notes || '-' }}</td>
          <td class="p-2">{{ e.User?.name || '-' }}</td>
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
          <h2 class="text-xl font-semibold">Novo Evento</h2>
          <button class="text-slate-400 hover:text-white" @click="closeForm">✕</button>
        </div>

        <form @submit.prevent="submit" class="space-y-3 text-sm">

          <div>
            <label class="block mb-1">Máquina *</label>
            <select
                v-model="form.machineId"
                required
                class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
            >
              <option value="">Selecionar</option>
              <option v-for="m in machinesStore.list" :key="m.id" :value="m.id">
                {{ m.code }} - {{ m.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Tipo de Evento *</label>
            <select
                v-model="form.eventType"
                required
                class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
            >
              <option value="MISSING_MESH">Missing Mesh</option>
              <option value="SKEW">Skew</option>
              <option value="WRONG_CELL">Wrong Cell</option>
              <option value="DAMAGED_CELL">Damaged Cell</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label class="block mb-1">Data/Hora</label>
            <input
                v-model="form.eventDatetime"
                type="datetime-local"
                class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">Notas</label>
            <textarea
                v-model="form.notes"
                rows="2"
                class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
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
                class="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-500"
                :disabled="saving"
            >
              {{ saving ? 'A guardar...' : 'Guardar' }}
            </button>
          </div>

        </form>
      </div>
    </div>

    <div v-if="eventsStore.loading" class="text-sm text-slate-400">
      A carregar eventos...
    </div>
    <div v-if="eventsStore.error" class="text-sm text-red-400">
      {{ eventsStore.error }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMachinesStore } from "@/stores/machinesStore.js";
import { useLayupEventsStore } from "@/stores/layupEventsStore.js";

const machinesStore = useMachinesStore();
const eventsStore = useLayupEventsStore();

// UI state
const showForm = ref(false);
const saving = ref(false);

const filters = ref({
  machineId: "",
  eventType: "",
  from: "",
  to: "",
});

const form = ref({
  machineId: "",
  eventType: "",
  eventDatetime: "",
  notes: "",
});

function formatDate(val) {
  if (!val) return "-";
  const d = new Date(val);
  return d.toLocaleString();
}

async function load() {
  const params = {};
  if (filters.value.machineId) params.machineId = filters.value.machineId;
  if (filters.value.from) params.from = filters.value.from + "T00:00:00";
  if (filters.value.to) params.to = filters.value.to + "T23:59:59";

  await eventsStore.loadEvents(params);
}

const filteredList = computed(() => {
  return eventsStore.list.filter(e => {
    const type = e.event_type || e.eventType;
    if (filters.value.eventType && type !== filters.value.eventType) return false;
    return true;
  });
});

function applyLocalFilter() {
  // filtro de tipo é aplicado só no computed filteredList
}

function resetForm() {
  form.value = {
    machineId: "",
    eventType: "",
    eventDatetime: "",
    notes: "",
  };
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function submit() {
  try {
    saving.value = true;

    const payload = {
      machineId: form.value.machineId,
      eventType: form.value.eventType,
      eventDatetime: form.value.eventDatetime || null,
      notes: form.value.notes || null,
    };

    await eventsStore.addEvent(payload);
    closeForm();
  } catch (err) {
    console.error(err);
    alert("Erro ao guardar evento.");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  if (!machinesStore.list.length) {
    await machinesStore.loadMachines();
  }
  await load();
});
</script>
