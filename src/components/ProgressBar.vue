<script setup lang="ts">
withDefaults(
  defineProps<{
    percentage: number
    flex?: boolean
  }>(),
  { flex: false }
)
</script>

<template>
  <div class="progress-bar-track" :class="{ 'progress-bar-track--flex': flex }">
    <div class="progress-bar-fill" :style="{ width: `${Math.min(percentage, 100)}%` }"></div>
  </div>
</template>

<style scoped>
.progress-bar-track {
  height: 3px;
  background: var(--border-color);
  border-radius: 1.5px;
  overflow: hidden;
}

.progress-bar-track--flex {
  flex: 1;
}

.progress-bar-fill {
  height: 100%;
  background: var(--highlight-color);
  border-radius: 1.5px;
  transition: width 0.4s ease;
}
</style>
