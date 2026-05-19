<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stars = ref<Array<{ top: string; left: string; delay: number; duration: number; size: number }>>([])

onMounted(() => {
  for (let i = 0; i < 60; i++) {
    stars.value.push({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      size: Math.random() < 0.2 ? 3 : 2,
    })
  }
})
</script>

<template>
  <div class="stars-container">
    <div
      v-for="(star, index) in stars"
      :key="index"
      class="star"
      :style="{
        top: star.top,
        left: star.left,
        width: star.size + 'px',
        height: star.size + 'px',
        animationDelay: star.delay + 's',
        animationDuration: star.duration + 's',
      }"
    />
  </div>
</template>

<style scoped>
.stars-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0;
  animation: twinkle infinite ease-in-out;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
