<template>
  <div class="p-6 space-y-6 text-slate-50">

    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">String Rejections</h1>
      <button class="btn-primary" @click="showForm = true">
        + Nova Rejeição
      </button>
    </div>

    <!-- Filtros -->
    <div class="card grid grid-cols-1 md:grid-cols-5 gap-4">
      <select v-model="filters.machineId" class="input" @change="load">
        <option value="">Máquina</option>
        <option
            v-for="m in machinesStore.list"
            :key="m.id"
            :value="m.id"
        >
          {{ m.name }} ({{ m.code }})
        </option>
      </select>

      <select v-model="filters.category" class="input" @change="load">
        <option value="">Tipo</option>
        <option value="MC">MC</option>
        <option value="UPS">UPS</option>
        <option value="RM">RM</option>
        <option value="BC">BC</option>
        <option value="OTHER">Other</option>
        <option value="GOOD_REJECTED">Good Rejected</option>
      </select>

      <select v-model="filters.source" class="input" @change="load">
        <option value="">Origem</option>
        <option value="MACHINE">Machine</option>
        <option value="OPERATOR">Operator</option>
      </select>

      <!-- espaço futuro para datas ou outros filtros -->
      <div></div>
      <div></div>
    </div>

    <!-- Tabela -->
    <div class="card">
      <table class="table-shell">
        <thead class="table-header">
        <tr>
          <th class="table-cell">Máquina</th>
          <th class="table-cell">Tipo</th>
          <th class="table-cell">Source</th>
          <th class="table-cell">Side</th>
          <th class="table-cell">Datetime</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="r in rejects.list"
            :key="r.id"
            class="table-row"
        >
          <td class="table-cell">
            {{ r.Machine?.name }} <span class="text-slate-400" v-if="r.Machine?.code">({{ r.Machine.code }})</span>
          </td>
          <td class="table-cell">
            {{ r.category }}
          </td>
          <td class="table-cell">
            {{ r.source }}
          </td>
          <td class="table-cell">
            {{ r.side || '-' }}
          </td>
          <td class="table-cell-muted">
            {{ new Date(r.createdAt || r.created_at).toLocaleString() }}
          </td>
        </tr>
        <tr v-if="!rejects.loading && rejects.list.length === 0">
          <td class="table-cell-muted" colspan="5">
            Sem registos para os filtros atuais.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <RejectionForm
        v-if="showForm"
        @submitted="refresh"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RejectionForm from '@/components/RejectionForm.vue';
import { useRejectionsStore } from '@/stores/stringRejectionsStore.js';
import { useMachinesStore } from '@/stores/machinesStore.js';

const rejects = useRejectionsStore();
const machinesStore = useMachinesStore();

const showForm = ref(false);

const filters = ref({
  machineId: '',
  category: '',
  source: '',
});

async function load() {
  await rejects.loadRejections(filters.value);
}

async function refresh() {
  showForm.value = false;
  await load();
}

// inicialização
machinesStore.loadMachines();
load();
</script>
