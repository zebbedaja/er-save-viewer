<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    percentage: number
    height?: number
    showTrack?: boolean
  }>(),
  { height: 3, showTrack: true },
)

const progressBarStyle = computed(() => {
  return {
    width: `${Math.min(Math.abs(props.percentage) / 2, 100)}%`,
    left: `${props.percentage >= 0 ? 50 : 'initial'}%`,
    right: `${props.percentage < 0 ? 50 : 'initial'}%`,
    background: props.percentage >= 0 ? '#9e4a44' : '#5d8a5f',
  }
})
</script>

<template>
  <div class="progress-bar">
    <div
      class="progress-bar-track"
      :style="{ height: height + 'px', background: showTrack ? 'var(--border-color)' : 'transparent' }"
    >
      <div class="progress-bar-fill" :style="progressBarStyle"></div>
      <div class="progress-center" :style="{ height: height * 2 + 'px', top: height / -2 + 'px' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  position: relative;
  min-width: 50px;
}

.progress-bar-track {
  position: relative;
  background: var(--border-color);
  border-radius: 1.5px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 1.5px;
  transition: width 0.4s ease;
  position: absolute;
}

.progress-center {
  position: absolute;
  width: 1px;
  left: 50%;
  background: #777;
}
</style>
