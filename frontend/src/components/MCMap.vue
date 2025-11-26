<template>
  <div
      ref="box"
      class="relative w-64 h-96 bg-gray-200 border border-gray-400 rounded cursor-crosshair"
      @click="handleClick"
  >
    <div
        v-if="value"
        class="absolute w-3 h-3 bg-red-600 rounded-full"
        :style="{
        left: `calc(${value.x * 100}% - 6px)`,
        top: `calc(${value.y * 100}% - 6px)`
      }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: Object,
});
const emit = defineEmits(['update:modelValue']);

const box = ref(null);

function handleClick(e) {
  const rect = box.value.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  emit('update:modelValue', { x, y });
}
</script>
