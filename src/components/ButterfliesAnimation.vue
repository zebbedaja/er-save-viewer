<script setup lang="ts">
import { ref, onMounted } from 'vue'

const butterflies = ref<
  Array<{
    top: string
    left: string
    delay: number
    duration: number
    size: number
    flapSpeed: number
  }>
>([])

onMounted(() => {
  for (let i = 0; i < 15; i++) {
    butterflies.value.push({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      size: 14 + Math.random() * 14,
      flapSpeed: 0.3 + Math.random() * 0.4,
    })
  }
})
</script>

<template>
  <div class="butterfly-container">
    <div
      v-for="(butterfly, index) in butterflies"
      :key="index"
      class="butterfly-wrapper"
      :style="{
        top: butterfly.top,
        left: butterfly.left,
        animationDelay: butterfly.delay + 's',
        animationDuration: butterfly.duration + 's',
      }"
    >
      <div
        class="butterfly"
        :style="{
          width: butterfly.size + 'px',
          height: butterfly.size + 'px',
          '--flap-speed': butterfly.flapSpeed + 's',
        }"
      >
        <svg viewBox="0 0 100 80" fill="currentColor">
          <g class="wing-left">
            <ellipse cx="30" cy="25" rx="22" ry="18" opacity="0.75" />
            <ellipse cx="32" cy="55" rx="16" ry="14" opacity="0.6" />
          </g>
          <g class="wing-right">
            <ellipse cx="70" cy="25" rx="22" ry="18" opacity="0.75" />
            <ellipse cx="68" cy="55" rx="16" ry="14" opacity="0.6" />
          </g>
          <ellipse cx="50" cy="40" rx="2" ry="20" opacity="0.9" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.butterfly-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.butterfly-wrapper {
  position: absolute;
  opacity: 0;
  animation: flutter infinite ease-in-out;
}

.butterfly {
  color: #f0a0c0;
}

.butterfly svg {
  display: block;
  width: 100%;
  height: 100%;
}

.butterfly :deep(.wing-left) {
  transform-origin: 50px 40px;
  animation: flap-left var(--flap-speed, 0.4s) infinite ease-in-out;
}

.butterfly :deep(.wing-right) {
  transform-origin: 50px 40px;
  animation: flap-right var(--flap-speed, 0.4s) infinite ease-in-out;
}

@keyframes flutter {
  0% {
    opacity: 0;
    transform: translateY(0) translateX(0) scale(0.8);
  }

  15% {
    opacity: 0.8;
  }

  50% {
    transform: translateY(-40px) translateX(20px) scale(1);
    opacity: 1;
  }

  85% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
    transform: translateY(-80px) translateX(-10px) scale(0.8);
  }
}

@keyframes flap-left {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.3);
  }
}

@keyframes flap-right {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.3);
  }
}
</style>
