<script setup lang="ts">
withDefaults(
  defineProps<{
    percentage: number
    flex?: boolean
    caps?: number[]
    showCaps?: boolean
  }>(),
  { flex: false, caps: () => [], showCaps: false },
)
</script>

<template>
  <div class="progress-bar">
    <div class="progress-bar-track" :class="{ 'progress-bar-track--flex': flex }">
      <div class="progress-bar-fill" :style="{ width: `${Math.min(percentage, 100)}%` }"></div>
    </div>
    <div class="caps" v-if="showCaps">
      <div class="cap" v-for="cap in caps" :key="cap" :style="{ left: cap + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  position: relative;
}

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

.caps {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cap {
  position: absolute;
  width: 1px;
  height: 9px;
  top: -3px;
  background: #aaa;
}
</style>
