<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    size?: number
  }>(),
  {
    message: '',
    size: 2,
  },
)
</script>

<template>
  <div class="loading-indicator">
    <svg class="spinner" :width="size * 16" :height="size * 16" viewBox="0 0 50 50">
      <circle class="spinner-path" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
    </svg>
    <span v-if="message" class="loading-text">{{ message }}</span>
  </div>
</template>

<style scoped>
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: var(--link-color);
}

.spinner {
  animation: spin 1s linear infinite;
}

.spinner-path {
  stroke: var(--link-color);
  stroke-dasharray: 94;
  stroke-dashoffset: 200;
  stroke-linecap: round;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
