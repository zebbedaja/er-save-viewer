<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'

defineProps<{
  label: string
  value: string
  percentage: number
}>()
</script>

<template>
  <div class="progress-row">
    <span class="progress-row-label">{{ label }}</span>
    <span class="progress-row-value">{{ value }}</span>
    <ProgressBar flex :percentage="percentage" />
  </div>
</template>

<style scoped>
.progress-row {
  display: grid;
  grid-template-columns: 8rem 3rem 1fr;
  align-items: center;
  gap: 0.4rem;
  padding: 0.15rem 0;
}

.progress-row-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-row-value {
  font-size: 0.75rem;
  color: var(--highlight-color);
  font-weight: bold;
  text-align: right;
}
</style>
